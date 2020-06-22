const connection = require('../../core/db/dbConn');
const async = require('async');
const numeral = require('numeral');

exports.dungeonLayout = function(req, res) {
	if (req.body.x) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
	}
	if (req.session.loggedIn) {
		if (req.body.x === 1) {
			connection.query('SELECT * FROM users_dungeons WHERE user = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				if (results.length > 0) {
					res.write('<div class="row"><div class="col" style="text-align:center">');
					res.write('<h3>' + dungeons[results[0].dungeon - 1].name + '</h3><h5>Room ' + results[0].progress + '/' + dungeons[results[0].dungeon - 1].rooms + '</h5>');
					res.write('<input type="button" id="bb" class="btn btn-warning" onclick="dungeonBattle()" value="Battle!">');
					res.write('</div></div>');
					res.end();
				} else {
					function makeList(param) {
						let list = '<ul>';
						for (let x = 0; x < param.length; x++) {
							list += '<li>' + items[param[x].drop - 1].name + '</li>';
						}
						list += '</ul>';
						return list;
					}
					res.write('<div class="row" style="margin-left:0;margin-right:0"><div class="col-4"><div class="nav nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical" style="max-height:250px;overflow-y:auto">');
					for (let x = 0; x < dungeons.length; x++) {
						if (x === 0) {
							res.write('<a class="nav-link text-light active" id="v-pills-' + dungeons[x].id + '-tab" data-toggle="pill" href="#v-pills-' + dungeons[x].id + '" role="tab" aria-controls="v-pills-' + dungeons[x].id + '" aria-selected="true">' + dungeons[x].name + '</a>');
						} else {
							res.write('<a class="nav-link text-light" id="v-pills-' + dungeons[x].id + '-tab" data-toggle="pill" href="#v-pills-' + dungeons[x].id + '" role="tab" aria-controls="v-pills-' + dungeons[x].id + '" aria-selected="false">' + dungeons[x].name + '</a>');
						}
					}
					res.write('</div></div><div class="col-8"><div class="tab-content" id="v-pills-tabContent">');
					for (let x = 0; x < dungeons.length; x++) {
						let filteredDrops = dungeons_drops.filter(function(e) {
							return e.dungeon === x + 1;
						});
						if (x === 0) {
							res.write('<div class="tab-pane fade show active" id="v-pills-' + dungeons[x].id + '" role="tabpanel" aria-labelledby="v-pills-' + dungeons[x].id + '-tab"><b>Level requirement:</b> ' + numeral(dungeons[x].level).format('0,0') + '<br /><br />' + dungeons[x].description + '<br /><br /><u class="font-weight-bold">Possible Drops</u>' + makeList(filteredDrops) + '<br /><div style="text-align:center"><input type="button" onclick="dungeons(2,' + dungeons[x].id + ')" value="Enter this dungeon" class="btn btn-outline-light border-white"></div></div>');
						} else {
							res.write('<div class="tab-pane fade" id="v-pills-' + dungeons[x].id + '" role="tabpanel" aria-labelledby="v-pills-' + dungeons[x].id + '-tab"><b>Level requirement:</b> ' + numeral(dungeons[x].level).format('0,0') + '<br /><br />' + dungeons[x].description + '<br /><br /><u class="font-weight-bold">Possible Drops</u>' + makeList(filteredDrops) + '<br /><div style="text-align:center"><input type="button" onclick="dungeons(2,' + dungeons[x].id + ')" value="Enter this dungeon" class="btn btn-outline-light border-white"></div></div>');
						}
					}
					res.write('</div></div></div>');
					res.end();
				}
			});
		} else if (req.body.x === 2) {
			connection.query('SELECT * FROM users_dungeons WHERE user = ?', [req.session.userid], function(error, userKeys) {
				if (error) {
					return res.end('error');
				}
				if (userKeys.length !== 0) {
					return res.end('Already in a dungeon!');
				}
				if (Number.isInteger(parseInt(req.body.y)) && req.body.y <= dungeons.length && req.body.y > 0) {
					const dungeon_keys = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
					connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [dungeon_keys[req.body.y - 1], req.session.userid], function(error, results) {
						if (error) {
							return res.end('Error');
						}
						if (results.length === 0) {
							return res.status(401).end('<div style="text-align:center">Not enough keys for selected dungeon.</div>');
						} else {
							if (results[0].quantity === 1) {
								connection.getConnection(function(error, connection) {
									if (error) {
										return res.end('error');
									}
									connection.beginTransaction(function(error) {
										if (error) {
											return res.end('error');
										}
										connection.query('DELETE FROM users_items WHERE item = ? AND user = ?', [dungeon_keys[req.body.y - 1], req.session.userid], function(error) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											}
											connection.query('INSERT INTO users_dungeons SET ?', {
												user: req.session.userid,
												dungeon: req.body.y,
												progress: 1
											}, function(error) {
												if (error) {
													connection.rollback();
													return res.end('server error.');
												}
												connection.commit(function(error) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													connection.release();
													res.end();
												});
											});
										});
									});
								});
							} else {
								connection.getConnection(function(error, connection) {
									if (error) {
										return res.end('error');
									}
									connection.beginTransaction(function(error) {
										if (error) {
											return res.end('error');
										}
										connection.query('UPDATE users_items SET quantity = quantity - 1 WHERE item = ? AND user = ?', [dungeon_keys[req.body.y - 1], req.session.userid], function(error) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											}
											connection.query('INSERT INTO users_dungeons SET ?', {
												user: req.session.userid,
												dungeon: req.body.y,
												progress: 1
											}, function(error) {
												if (error) {
													connection.rollback();
													return res.end('server error.');
												}
												connection.commit(function(error) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													connection.release();
													res.end();
												});
											});
										});
									});
								});
							}
						}
					});
				} else {
					res.status(401).end('misc error');
				}
			});
		} else {
			res.end('invalid');
		}
	} else {
		res.end('not logged in');
	}
};

exports.dungeonBattle = function(req, res) {
	if (req.session.loggedIn) {
		connection.query('SELECT * FROM users_dungeons WHERE user = ?', [req.session.userid], function(error, uDungeon) {
			if (error) {
				return res.end('error');
			}
			if (uDungeon.length === 0) {
				return res.end('???');
			}
			let uData;
			async.waterfall([
				function(callback) {
					connection.query('SELECT * FROM users WHERE id = ?', [req.session.userid], function(error, results) {
						if (error) {
							return res.end(error);
						}
						uData = results;
						connection.query('SELECT * FROM users_items WHERE user = ? AND equipped = 1', [req.session.userid], function(error, uItems) {
							if (error) {
								return res.end('error');
							}
							if (uItems.length > 0) {
								for (let z = 0; z < uItems.length; z++) {
									uData[0].health += items[uItems[z].item - 1].health;
									uData[0].attack += items[uItems[z].item - 1].attack;
									uData[0].defense += items[uItems[z].item - 1].defense;
									uData[0].accuracy += items[uItems[z].item - 1].accuracy;
									uData[0].evasion += items[uItems[z].item - 1].evasion;
								}
								if (uData[0].health < 0) {
									uData[0].health = 0;
								}
								if (uData[0].attack < 0) {
									uData[0].attack = 0;
								}
								if (uData[0].defense < 0) {
									uData[0].defense = 0;
								}
								if (uData[0].accuracy < 0) {
									uData[0].accuracy = 0;
								}
								if (uData[0].evasion < 0) {
									uData[0].evasion = 0;
								}
								callback();
							} else {
								callback();
							}
						});
					});
				}
			], function(error) {
				/**
				 * @param thisMon.hp
				 * @param thisMon.atk
				 * @param thisMon.def
				 * @param thisMon.acc
				 * @param thisMon.eva
				 */
				if (error) {
					return res.end('error');
				}
				let powFxn = (z) => {
					return (z * (z - 1)) / 2 + 1;
				};
				let getMonster = dungeons_monsters.filter(function(e) {
					return e.progress === uDungeon[0].progress && e.dungeon === uDungeon[0].dungeon;
				});
				let thisMon = getMonster[0];
				if (uDungeon[0].progress === getMonster[0].progress && uDungeon[0].dungeon === getMonster[0].dungeon) {
					let rounds = 0;
					let damageToYou = 0;
					let damageToThey = 0;
					let Ymisses = 0;
					let Mmisses = 0;
					let Ydodges = 0;
					let Mdodges = 0;
					let monName = thisMon.name;
					let monHP = thisMon.hp;
					const monHPStatic = monHP;
					let monATK = thisMon.atk;
					let monDEF = thisMon.def;
					let monACC = (thisMon.acc + 5000) / 10000;
					let monEVA = thisMon.eva / 10000;
					let userHP = (uData[0].level * uData[0].health) + (10 * uData[0].level);
					const userHPStatic = userHP;
					let userATK = Math.floor(uData[0].attack * (powFxn(uData[0].shortsword) + powFxn(uData[0].dagger))) * (powFxn(uData[0].shortsword) + powFxn(uData[0].dagger));
					let userDEF = uData[0].defense + powFxn(uData[0].helmet) + powFxn(uData[0].shoulders) + powFxn(uData[0].wrists) + powFxn(uData[0].gloves) + powFxn(uData[0].chestpiece) + powFxn(uData[0].leggings) + powFxn(uData[0].boots);
					let userACC = (uData[0].accuracy + 5000) / 10000;
					let userEVA = uData[0].evasion / 10000;
					while (monHP > 0 && userHP > 0 && rounds < 50) {
						let rngDY = (Math.random()).toFixed(4);
						if (userACC >= rngDY) {
							if (rngDY > monEVA) {
								monHP -= Math.floor(userATK / (monDEF + 1));
								damageToThey += Math.floor(userATK / (monDEF + 1));
							} else if (rngDY <= monEVA) {
								Mdodges++;
							}
							if (monHP <= 0) {
								monHP = 0;
								rounds++;
								break;
							}
						} else if (userACC < rngDY) {
							Ymisses++;
						}
						let rngDM = (Math.random()).toFixed(4);
						if (monACC >= rngDM) {
							if (rngDM > userEVA) {
								userHP -= Math.floor(monATK / (userDEF + 1));
								damageToYou += Math.floor(monATK / (userDEF + 1));
							} else if (rngDM <= userEVA) {
								Ydodges++;
							}
							if (userHP <= 0) {
								userHP = 0;
								rounds++;
								break;
							}
						} else if (monACC < rngDM) {
							Mmisses++;
						}
						rounds++;
					}
					let userHPFancy = '<div class="container"><div class="row"><div class="col"></div><div class="col-6"><div class="progress" style="background-color:darkred"><div class="progress-bar bg-success" role="progressbar" style="width: ' + (userHP / userHPStatic) * 100 + '%;" aria-valuemin="0" aria-valuemax="100"><div style="text-align:center;font-weight:bold;" class="justify-content-center d-flex position-absolute w-100">' + numeral(userHP).format('0,0') + '</div></div></div></div><div class="col"></div></div></div>';
					let monHPFancy = '<div class="container"><div class="row"><div class="col"></div><div class="col-6"><div class="progress" style="background-color:darkred"><div class="progress-bar bg-success" role="progressbar" style="width: ' + (monHP / monHPStatic) * 100 + '%;" aria-valuemin="0" aria-valuemax="100"><div style="text-align:center;font-weight:bold;" class="justify-content-center d-flex position-absolute w-100">' + numeral(monHP).format('0,0') + '</div></div></div></div><div class="col"></div></div></div>';
					let row1Text = '<div class="row" style="text-align:center"><div class="col">' + req.session.username + '<br />' + userHPFancy + '<div style="display:inline-block;text-align:left"><i class="fas fa-fist-raised fa-fw"></i> Damage: ' + numeral(Math.floor(damageToThey)).format('0,0') + '<br /><i class="fas fa-bullseye fa-fw"></i> Hits: ' + (rounds - Ymisses) + '<br /><i class="fas fa-fish fa-fw"></i> Dodges: ' + Ydodges + '<br /><i class="fas fa-wind fa-fw"></i> Missed Hits: ' + Ymisses + '</div></div><div class="col">' + monName + '<br />' + monHPFancy + '<div style="display:inline-block;text-align:left"><i class="fas fa-fist-raised fa-fw"></i> Damage: ' + numeral(Math.floor(damageToYou)).format('0,0') + '<br /><i class="fas fa-bullseye fa-fw"></i> Hits: ' + (rounds - Mmisses) + '<br /><i class="fas fa-fish fa-fw"></i> Dodges: ' + Mdodges + '<br /><i class="fas fa-wind fa-fw"></i> Missed Hits: ' + Mmisses + '</div></div></div>';
					let rowWinText = '<div class="text-center"><span style="color:green" class="font-weight-bold">You defeated the ' + monName + ' after ' + rounds + ' rounds.</span></div>';
					let rowTieText = '<div class="text-center"><span style="color:yellow" class="font-weight-bold">A draw has been declared as no one won within 50 rounds.</span></div>';
					let rowDefeatText = '<div class="text-center"><span style="color:red" class="font-weight-bold">You were defeated by the ' + monName + ' after ' + rounds + ' rounds.</span></div>';
					let rowContText = '<div class="row"><div class="col" style="text-align:center"><input type="button" id="bb" class="btn btn-outline-light" value="Continue" onclick="dungeons(1)" disabled></div></div>';
					let passRNG = () => {
						return (1 / Math.pow(2, uDungeon[0].progress)) >= Math.random();
					};
					if (monHP < 1) {
						if (passRNG()) {
							if (uDungeon[0].progress < dungeons[uDungeon[0].dungeon].rooms) {
								connection.query('UPDATE users_dungeons SET progress = progress + 1 WHERE user = ?', [req.session.userid], function(error) {
									if (error) {
										return res.end('error');
									}
									res.write(row1Text + '<div class="row"><div class="col text-center">' + rowWinText + '<br /><div>You have proceeded to the next room!</div><br /></div></div>');
									res.write(rowContText);
									res.end();
								});
							} else {
								let getRandomDrop = () => {
									let possibleDrops = dungeons_drops.filter(function(e) {
										return e.dungeon === uDungeon[0].dungeon;
									});
									let willDrop = possibleDrops[Math.floor(Math.random() * (possibleDrops.length - 1 + 1))];
									return willDrop.drop;
								};
								let newDrop = getRandomDrop();
								if (Math.random() > 0.5) {
									connection.query('SELECT * FROM users_item WHERE item = ? AND user = ?', [newDrop, req.session.userid], function(error, results) {
										if (error) {
											return res.end('error');
										}
										if (results.length > 0) {
											connection.getConnection(function(error, connection) {
												if (error) {
													return res.end('error');
												}
												connection.beginTransaction(function(error) {
													if (error) {
														return res.end('error');
													}
													connection.query('UPDATE users_items SET quantity = quantity + 1 WHERE item = ? AND user = ?', [newDrop, req.session.userid], function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														}
														connection.query('DELETE FROM users_dungeons WHERE user = ?', [req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.commit(function(error) {
																if (error) {
																	connection.rollback();
																	return res.end('server error.');
																}
																connection.release();
																res.end('<div class="row"><div class="col text-center">Dungeon Complete!<br />You received: ' + items[newDrop - 1].name + '</div></div>');
															});
														});
													});
												});
											});
										} else {
											connection.getConnection(function(error, connection) {
												if (error) {
													return res.end('error');
												}
												connection.beginTransaction(function(error) {
													if (error) {
														return res.end('error');
													}
													connection.query('INSERT INTO users_items SET ?', {user: req.session.userid, item: newDrop, quantity: 1}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														}
														connection.query('DELETE FROM users_dungeons WHERE user = ?', [req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.commit(function(error) {
																if (error) {
																	connection.rollback();
																	return res.end('server error.');
																}
																connection.release();
																res.end('<div class="row"><div class="col text-center">Dungeon Complete!<br />You received: ' + items[newDrop - 1].name + '</div></div>');
															});
														});
													});
												});
											});
										}
									});
								} else {
									connection.query('DELETE FROM users_dungeons WHERE user = ?', [req.session.userid], function(error) {
										if (error) {
											return res.end('error');
										}
										res.end('<div class="row"><div class="col text-center">Dungeon Complete!<br />You didn\'t receive any drops.</div></div>');
									});
								}
							}
						} else {
							res.write(row1Text + '<div class="row"><div class="col text-center">' + rowWinText + '</div></div>');
							res.write(rowContText);
							res.end();
						}
					} else if (userHP < 1) {
						res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem">' + rowDefeatText + '</div></div>' + rowContText);
						res.end();
					} else if (userHP > 0 && monHP > 0 && rounds >= 50) {
						res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem">' + rowTieText + '</div></div>' + rowContText);
						res.end();
					}
				} else {
					res.end('An error occurred.');
				}
			});
		});
	} else {
		res.end('not logged in');
	}
};
