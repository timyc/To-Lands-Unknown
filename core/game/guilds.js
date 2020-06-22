const connection = require('../../core/db/dbConn');
const numeral = require('numeral');
const toCoin = require('../../core/utils/coins');

module.exports = function(req, res) {
	if (req.session.loggedIn) {
		if (req.body.x) {
			// noinspection JSCheckFunctionSignatures
			if (Number.isInteger(parseInt(req.body.x))){
				// noinspection JSCheckFunctionSignatures
				req.body.x = parseInt(req.body.x);
			} else {
				return res.end();
			}
		}
		if (req.body.z) {
			// noinspection JSCheckFunctionSignatures
			if (Number.isInteger(parseInt(req.body.z))){
				// noinspection JSCheckFunctionSignatures
				req.body.z = parseInt(req.body.z);
			} else {
				return res.end();
			}
		}
		let menu = '<input type="button" onclick="guildpage(0)" value="Home" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="guildpage(1)" value="Members" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="guildpage(3)" value="Donate" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="guildpage(4)" value="Buildings" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="guildpage(12)" value="Settings" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="guildpage(13)" value="Logs" class="btn btn-outline-light border-white btn-sm">';
		connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, guildData) {
			if (error) {
				return res.end('error');
			}
			if (req.body.x === 0) {
				connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
					/**
					 * @param results.ginviteid
					 * @param results.hpboost
					 * @param results.atkboost
					 */
					if (error) {
						res.send('error');
					}
					if (results.length === 0) {
						res.write('<h4 class="text-center">You are not in a guild.</h4>');
						res.write('<div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><div>Creating your own guild costs 30 platinum.</div>');
						res.write('<div class="input-group text-center"><input type="text" id="guildname" autocomplete="off" class="form-control text-white" placeholder="30 chars max. NO SPACES." style="background:rgba(0,0,0,0.4)"><div class="input-group-append"><input type="button" class="btn btn-outline-light" value="Create" onclick="guildpage(2);"></div></div>');
						connection.query('SELECT guilds.name AS name, users_guilds_invites.user AS user, users_guilds_invites.guild AS guild, users_guilds_invites.id AS ginviteid FROM guilds, users_guilds_invites WHERE users_guilds_invites.user = ? AND users_guilds_invites.guild = guilds.id', [req.session.userid], function(error, results) {
							if (error) {
								res.write('error');
							} else {
								res.write('<u>Invites:</u> <br />');
								for (let x = 0; x < results.length; x++) {
									res.write(results[x].name + ' <a href="javascript:guildpage(11, ' + results[x].ginviteid + ');" class="text-light">[Join]</a> <br />');
								}
								res.write('</div></div>');
								res.end();
							}
						});
					} else {
						connection.query('SELECT * FROM guilds WHERE id = ?', [guildData[0].guild], function(error, results) {
							res.write('<div class="row"><div class="col" style="text-align:center"><h3>' + results[0].name + '</h3><p>' + results[0].motd + '</p>');
							res.write('</div></div>');
							res.write('<div class="row" style="margin-left:50px;margin-right:50px">');
							res.write('<div class="col-4"><span class="font-weight-bold">Apothecary:</span> ' + results[0].hpboost + '<br /><span class="font-weight-bold">Barracks:</span> ' + results[0].atkboost + '<br /></div>');
							res.write('<div class="col"></div>');
							res.write('<div class="col-4"><span class="font-weight-bold">Coins:</span> ' + toCoin(results[0].gold) + '<br /><span class="font-weight-bold">Credits:</span> ' + results[0].credits + '<br /><span class="font-weight-bold">Mithril:</span> ' + results[0].mithril + '<br /><span class="font-weight-bold">Timber:</span> ' + results[0].timber + '<br /><span class="font-weight-bold">Stones:</span> ' + results[0].stones + '<br /></div>');
							res.write('</div><br />');
							res.write('<div class="row"><div class="col text-center">');
							res.write(menu);
							res.write('</div></div>');
							res.end();
						});
					}
				});
			} else if (req.body.x === 2) {
				connection.query('SELECT gold FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (req.body.y == null || req.body.y === 'undefined' || (req.body.y).length > 30 || (req.body.y).replace(/[^a-z0-9]/gi, '') === '') {
						res.send('<h3 class="text-danger text-center">Name does not follow rules!</h3><div style="text-align:center"><input type="button" class="btn btn-outline-light" value="Back" onclick="guildpage(0);"></div>');
					} else if (results[0].gold < 30000000) {
						res.send('<h3 class="text-danger text-center">Not enough gold!</h3><div style="text-align:center"><input type="button" class="btn btn-outline-light" value="Back" onclick="guildpage(0);"></div>');
					} else {
						let insertObj1 = {
							name: (req.body.y).replace(/[^a-z0-9]/gi, '')
						};
						let insertObj2 = {
							user: req.session.userid,
							guild: 0,
							rank: 3
						};
						if (guildData.length > 0) {
							return res.end('<h3 class="text-danger text-center">Already in a guild!</h3><div style="text-align:center"><input type="button" class="btn btn-outline-light" value="Back" onclick="guildpage(0);"></div>');
						} else {
							connection.query('SELECT * FROM guilds WHERE name = ?', [(req.body.y).replace('/[^0-9a-z]/gi, ""')], function(error, results2) {
								if (error) {
									return res.end('error');
								} else if (results2.length > 0) {
									res.send('<h3 class="text-danger text-center">Name already in use!</h3><div style="text-align:center"><input type="button" class="btn btn-outline-light" value="Back" onclick="guildpage(0);"></div>[BREAK]' + (results[0].gold - 30000000) + '[BREAK]-');
								} else {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET gold = gold - 30000000 WHERE id = ?', [req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('error');
												}
												connection.query('INSERT INTO guilds SET ?', [insertObj1], function(error, results3) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													insertObj2.guild = results3.insertId;
													connection.query('INSERT INTO users_guilds SET ?', [insertObj2], function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															res.send('<h3 class="text-success">Successfully created your guild!</h3><div style="text-align:center"><input type="button" class="btn btn-outline-light" value="Go to guild" onclick="guildpage(0);"></div>[BREAK]' + (results[0].gold - 30000000) + '[BREAK]' + (req.body.y).replace(/[^a-z0-9]/gi, ''))
														});
													});
												});
											});
										});
									});
								}
							});
						}
					}
				});
			} else if (req.body.x === 1) {
				if (guildData.length > 0) {
					connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
						if (error) {
							return res.end('error');
						}
						res.write('<div style="text-align:center"><h3>Members <a href="javascript:guildpage(10);" class="text-light">[Leave Guild]</a></h3></div>');
						res.write('<div class="row"><div class="col text-center">');
						connection.query('SELECT users_guilds.user AS user, users_guilds.rank, users.username AS username, users.id AS userid FROM users_guilds, users WHERE users_guilds.guild = ? AND users.id = users_guilds.user ORDER BY users_guilds.rank DESC', [results[0].guild], function(error, results2) {
							if (error) {
								return res.end('database error');
							}
							for (let members = 0; members < results2.length; members++) {
								let memRank = 'undefined';
								if (results2[members].rank === 3) {
									memRank = 'Leader';
								} else if (results2[members].rank === 2) {
									memRank = 'Officer';
								} else {
									memRank = 'Member';
								}
								if (results[0].rank === 3) {
									if (results2[members].rank === 3) {
										res.write('<a href="javascript:profile(&quot;' + results2[members].username + '&quot;);" class="text-light">' + results2[members].username + '</a> (' + memRank + ')<br />');
									} else if (results2[members].rank === 2) {
										res.write('<a href="javascript:profile(&quot;' + results2[members].username + '&quot;);" class="text-light">' + results2[members].username + '</a> (' + memRank + ') <a href="javascript:guildpage(8, ' + results2[members].userid + ')" class="text-light">[Demote]</a> <a href="javascript:guildpage(5, ' + results2[members].userid + ')" class="text-light">[Kick]</a><br />');
									} else {
										res.write('<a href="javascript:profile(&quot;' + results2[members].username + '&quot;);" class="text-light">' + results2[members].username + '</a> (' + memRank + ') <a href="javascript:guildpage(9, ' + results2[members].userid + ')" class="text-light">[Promote]</a> <a href="javascript:guildpage(5, ' + results2[members].userid + ')" class="text-light">[Kick]</a><br />');
									}
								} else if (results[0].rank === 2) {
									res.write('<a href="javascript:profile(&quot;' + results2[members].username + '&quot;);" class="text-light">' + results2[members].username + '</a> (' + memRank + ') <a href="javascript:guildpage(5, ' + results2[members].userid + ')" class="text-light">[Kick]</a><br />');
								} else {
									res.write('<a href="javascript:profile(&quot;' + results2[members].username + '&quot;);" class="text-light">' + results2[members].username + '</a> (' + memRank + ')<br />');
								}
							}
							res.write('</div></div><br />');
							res.write('<div class="row"><div class="col text-center">');
							res.write(menu);
							res.write('</div></div>');
							res.end();
						});
					});
				} else {
					res.end('not in a guild!');
				}
			} else if (req.body.x === 3) {
				if (guildData.length > 0) {
					res.write('<div style="text-align:center"><h3>Donate</h3></div>');
					res.write('<div class="row"><div class="col"></div><div class="col-8">');
					res.write('<div class="input-group mb-3"><input type="number" min="1" autocomplete="off" id="donateGold" class="form-control border-white text-light" placeholder="Platinum" style="background-color: rgba(0, 0, 0, 0.3);"><div class="input-group-append"><input type="button" id="donateButton" class="btn btn-outline-light border-white" value="Donate" onclick="guildDonate(1);"></div></div>');
					res.write('<div class="input-group mb-3"><input type="number" min="1" autocomplete="off" id="donateCredits" class="form-control border-white text-light" placeholder="Credits" style="background-color: rgba(0, 0, 0, 0.3);"><div class="input-group-append"><input type="button" id="donateButton" class="btn btn-outline-light border-white" value="Donate" onclick="guildDonate(2);"></div></div>');
					res.write('<div class="input-group mb-3"><input type="number" min="1" autocomplete="off" id="donateMithril" class="form-control border-white text-light" placeholder="Mithril" style="background-color: rgba(0, 0, 0, 0.3);"><div class="input-group-append"><input type="button" id="donateButton" class="btn btn-outline-light border-white" value="Donate" onclick="guildDonate(3);"></div></div>');
					res.write('<div class="input-group mb-3"><input type="number" min="1" autocomplete="off" id="donateTimber" class="form-control border-white text-light" placeholder="Timber" style="background-color: rgba(0, 0, 0, 0.3);"><div class="input-group-append"><input type="button" id="donateButton" class="btn btn-outline-light border-white" value="Donate" onclick="guildDonate(4);"></div></div>');
					res.write('<div class="input-group mb-3"><input type="number" min="1" autocomplete="off" id="donateStones" class="form-control border-white text-light" placeholder="Stones" style="background-color: rgba(0, 0, 0, 0.3);"><div class="input-group-append"><input type="button" id="donateButton" class="btn btn-outline-light border-white" value="Donate" onclick="guildDonate(5);"></div></div>');
					res.write('</div><div class="col"></div></div>');
					res.write('<div class="row"><div class="col text-center">');
					res.write(menu);
					res.write('</div></div>');
					res.end();
				} else {
					res.end('not in guild');
				}
			} else if (req.body.x === 4) {
				connection.query('SELECT * FROM guilds WHERE id = ?', [guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write('<div style="text-align:center"><h3>Buildings</h3></div>');
					res.write('<div class="row"><div class="col" style="margin-left:30px;margin-right:30px;overflow-x:auto">');
					res.write('<table class="table table-borderless text-light" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Building</th><th scope="col">Coins</th><th scope="col">Credits</th><th scope="col">Mithril</th><th scope="col">Timber</th><th scope="col">Stones</th><th scope="col">Options</th></tr></thead><tbody>');
					res.write('<tr><td>Apothecary (Level ' + results[0].hpboost + ')</td>' + '<td>' + toCoin((results[0].hpboost + 1) * 5000000) + '</td>' + '<td>' + numeral((results[0].hpboost + 1) * 500).format('0,0') + '</td>' + '<td>' + numeral((results[0].hpboost + 1) * 2000).format('0,0') + '</td>' + '<td>' + numeral((results[0].hpboost + 1) * 10000).format('0,0') + '</td>' + '<td>' + numeral((results[0].hpboost + 1) * 10000).format('0,0') + '</td>' + '<td class="text-center"><input type="button" onclick="guildpage(6, 1)" value="[Upgrade]" class="moveBtn"></td>' + '</tr>');
					res.write('<tr><td>Barracks (Level ' + results[0].atkboost + ')</td>' + '<td>' + toCoin((results[0].atkboost + 1) * 5000000) + '</td>' + '<td>' + numeral((results[0].atkboost + 1) * 500).format('0,0') + '</td>' + '<td>' + numeral((results[0].atkboost + 1) * 2000).format('0,0') + '</td>' + '<td>' + numeral((results[0].atkboost + 1) * 10000).format('0,0') + '</td>' + '<td>' + numeral((results[0].atkboost + 1) * 10000).format('0,0') + '</td>' + '<td class="text-center"><input type="button" onclick="guildpage(6, 2)" value="[Upgrade]" class="moveBtn"></td>' + '</tr>');
					res.write('</tbody></table>');
					res.write('</div></div>');
					res.write('<div class="row"><div class="col text-center">');
					res.write(menu);
					res.write('</div></div>');
					res.end();
				});
			} else if (req.body.x === 5) {
				connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length < 1 || results[0].rank === 1) {
						return res.end('no');
					}
					connection.query('SELECT users_guilds.rank AS rank, users_guilds.guild AS guild, users_guilds.user AS user, users.username AS username, users.id AS userid FROM users_guilds, users WHERE users_guilds.user = ? AND users_guilds.guild = ? AND users_guilds.user = users.id', [req.body.y, results[0].guild], function(error, results2) {
						if (error) {
							return res.end('error');
						}
						if (results2.length < 1) {
							return res.end('User not in your guild.');
						}
						if (results2[0].rank === 3) {
							return res.end('<div style="text-align:center">Cannot kick the leader</div><br /><div style="text-align:center">' + menu + '</div>');
						}
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('error');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('error');
								}
								connection.query('DELETE FROM users_guilds WHERE user = ? AND guild = ?', [req.body.y, results[0].guild], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error');
									}
									connection.commit(function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error');
										}
										connection.release();
										res.end('<div style="text-align:center">Successfully removed ' + results2[0].username + '</div><br /><div style="text-align:center">' + menu + '</div>');
									});
								});
							});
						});
					});
				});
			} else if (req.body.x === 6) {
				if (guildData.length > 0) {
					connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
						if (error) {
							return res.end('database error');
						}
						if (results.length < 1) {
							return res.end('not in a guild');
						}
						if (results[0].rank < 3) {
							return res.end('<div style="text-align:center">Only the leader can upgrade!</div><br /><div style="text-align:center">' + menu + '</div>');
						}
						connection.query('SELECT * FROM guilds WHERE id = ?', [guildData[0].guild], function(error, results) {
							if (error) {
								return res.end('database error');
							}
							if (req.body.y === 1) {
								if (results[0].gold >= ((results[0].hpboost + 1) * 5000000) && results[0].credits >= ((results[0].hpboost + 1) * 500) && results[0].mithril >= ((results[0].hpboost + 1) * 2000) && results[0].timber >= ((results[0].hpboost + 1) * 10000) && results[0].stones >= ((results[0].hpboost + 1) * 10000)) {
									connection.query('UPDATE guilds SET hpboost = hpboost + 1, gold = gold - ?, credits = credits - ?, mithril = mithril - ?, timber = timber - ?, stones = stones - ? WHERE id = ?', [((results[0].hpboost + 1) * 5000000), ((results[0].hpboost + 1) * 500), ((results[0].hpboost + 1) * 2000), ((results[0].hpboost + 1) * 10000), ((results[0].hpboost + 1) * 10000), guildData[0].guild], function(error) {
										if (error) {
											return res.end('database error');
										}
										res.end('<div style="text-align:center">Successfully upgraded Apothecary!</div><br /><div style="text-align:center">' + menu + '</div>');
									});
								} else {
									res.end('<div style="text-align:center">Insufficient resources.</div><br /><div style="text-align:center">' + menu + '</div>');
								}
							} else if (req.body.y === 2) {
								if (results[0].gold >= ((results[0].atkboost + 1) * 5000000) && results[0].credits >= ((results[0].atkboost + 1) * 500) && results[0].mithril >= ((results[0].atkboost + 1) * 2000) && results[0].timber >= ((results[0].atkboost + 1) * 10000) && results[0].stones >= ((results[0].atkboost + 1) * 10000)) {
									connection.query('UPDATE guilds SET atkboost = atkboost + 1, gold = gold - ?, credits = credits - ?, mithril = mithril - ?, timber = timber - ?, stones = stones - ? WHERE id = ?', [((results[0].atkboost + 1) * 5000000), ((results[0].atkboost + 1) * 500), ((results[0].atkboost + 1) * 2000), ((results[0].atkboost + 1) * 10000), ((results[0].atkboost + 1) * 10000), guildData[0].guild], function(error) {
										if (error) {
											return res.end('database error');
										}
										res.end('<div style="text-align:center">Successfully upgraded Barracks!</div><br /><div style="text-align:center">' + menu + '</div>');
									});
								} else {
									res.end('<div style="text-align:center">Insufficient resources.</div><br /><div style="text-align:center">' + menu + '</div>');
								}
							} else {
								res.end('undefined');
							}
						});
					});
				} else {
					res.end('not in a guild');
				}
			} else if (req.body.x === 7) {
				if (req.body.y) {
					// noinspection JSCheckFunctionSignatures
					if (Number.isInteger(parseInt(req.body.y))){
						// noinspection JSCheckFunctionSignatures
						req.body.y = parseInt(req.body.y);
					} else {
						return res.end();
					}
				}
				if (guildData.length > 0) {
					connection.query('SELECT * FROM guilds WHERE id = ?', [guildData[0].guild], function(error, guildstuff) {
						if (error) {
							return res.end('database error');
						}
						if (req.body.y === 1 && req.body.z > 0) {
							connection.query('SELECT gold FROM users WHERE id = ?', [req.session.userid], function(error, results) {
								if (error) {
									return res.end('database error');
								}
								let donationString = '[BREAK]' + results[0].gold;
								if (results[0].gold * 1000000 >= req.body.z) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [req.body.z * 1000000, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('UPDATE guilds SET gold = gold + ? WHERE id = ?', [req.body.z * 1000000, guildData[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_guilds_logs SET ?', {
														user: req.session.userid,
														guild: guildstuff[0].id,
														action: (req.session.username + ' donated ' + req.body.z + ' platinum.')
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															let donationString = '[BREAK]' + (results[0].gold - (req.body.z * 1000000));
															res.end('<div style="text-align:center">Donation successful!</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
														});
													});
												});
											});
										});
									});
								} else {
									res.end('<div style="text-align:center">Insufficient currency</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
								}
							});
						} else if (req.body.y === 2 && req.body.z > 0) {
							connection.query('SELECT credits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
								if (error) {
									return res.end('database error');
								}
								let donationString = '[BREAK]' + results[0].credits;
								if (results[0].credits >= req.body.z) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET credits = credits - ? WHERE id = ?', [req.body.z, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('UPDATE guilds SET credits = credits + ? WHERE id = ?', [req.body.z, guildData[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_guilds_logs SET ?', {
														user: req.session.userid,
														guild: guildstuff[0].id,
														action: (req.session.username + ' donated ' + req.body.z + ' credits')
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															let donationString = '[BREAK]' + (results[0].credits - req.body.z);
															res.end('<div style="text-align:center">Donation successful!</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
														});
													});
												});
											});
										});
									});
								} else {
									res.end('<div style="text-align:center">Insufficient currency</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
								}
							});
						} else if (req.body.y === 3 && req.body.z > 0) {
							connection.query('SELECT mithril FROM users WHERE id = ?', [req.session.userid], function(error, results) {
								if (error) {
									return res.end('database error');
								}
								let donationString = '[BREAK]' + results[0].mithril;
								if (results[0].mithril >= req.body.z) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET mithril = mithril - ? WHERE id = ?', [req.body.z, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('UPDATE guilds SET mithril = mithril + ? WHERE id = ?', [req.body.z, guildData[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_guilds_logs SET ?', {
														user: req.session.userid,
														guild: guildstuff[0].id,
														action: (req.session.username + ' donated ' + req.body.z + ' mithril')
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															let donationString = '[BREAK]' + (results[0].mithril - req.body.z);
															res.end('<div style="text-align:center">Donation successful!</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
														});
													});
												});
											});
										});
									});
								} else {
									res.end('<div style="text-align:center">Insufficient currency</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
								}
							});
						} else if (req.body.y === 4 && req.body.z > 0) {
							connection.query('SELECT timber FROM users WHERE id = ?', [req.session.userid], function(error, results) {
								if (error) {
									return res.end('database error');
								}
								let donationString = '[BREAK]' + results[0].timber;
								if (results[0].timber >= req.body.z) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET timber = timber - ? WHERE id = ?', [req.body.z, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('UPDATE guilds SET timber = timber + ? WHERE id = ?', [req.body.z, guildData[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_guilds_logs SET ?', {
														user: req.session.userid,
														guild: guildstuff[0].id,
														action: (req.session.username + ' donated ' + req.body.z + ' timber')
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															let donationString = '[BREAK]' + (results[0].timber - req.body.z);
															res.end('<div style="text-align:center">Donation successful!</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
														});
													});
												});
											});
										});
									});
								} else {
									res.end('<div style="text-align:center">Insufficient currency</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
								}
							});
						} else if (req.body.y === 5 && req.body.z > 0) {
							connection.query('SELECT stones FROM users WHERE id = ?', [req.session.userid], function(error, results) {
								if (error) {
									return res.end('database error');
								}
								let donationString = '[BREAK]' + results[0].stones;
								if (results[0].stones >= req.body.z) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											connection.query('UPDATE users SET stones = stones - ? WHERE id = ?', [req.body.z, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('UPDATE guilds SET stones = stones + ? WHERE id = ?', [req.body.z, guildData[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_guilds_logs SET ?', {
														user: req.session.userid,
														guild: guildstuff[0].id,
														action: (req.session.username + ' donated ' + req.body.z + ' stones')
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															let donationString = '[BREAK]' + (results[0].stones - req.body.z);
															res.end('<div style="text-align:center">Donation successful!</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
														});
													});
												});
											});
										});
									});
								} else {
									res.end('<div style="text-align:center">Insufficient currency</div><br /><div style="text-align:center">' + menu + '</div>' + donationString);
								}
							});
						} else {
							res.end('<div style="text-align:center">Insufficient currencies OR amount less than or equal to 0</div><br /><div style="text-align:center">' + menu + '</div>');
						}
					});
				} else {
					res.end('not in a guild');
				}
			} else if (req.body.x === 8) {
				connection.query('SELECT users_guilds.rank, users_guilds.guild, guilds.name FROM users_guilds, guilds WHERE users_guilds.user = ? AND guilds.id = ?', [req.session.userid, guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1 && results[0].rank === 3) {
						connection.query('SELECT rank FROM users_guilds WHERE user = ?', [req.body.y], function(error, results2) {
							if (error) {
								return res.end('error');
							}
							if (results2.length === 1 && results2[0].rank === 2) {
								connection.query('UPDATE users_guilds SET rank = 1 WHERE user = ? AND guild = ?', [req.body.y, results[0].guild], function(error) {
									if (error) {
										return res.end('error');
									}
									res.end('<div style="text-align:center">Demotion successful!</div><br /><div style="text-align:center">' + menu + '</div>');
								});
							} else {
								res.end('User not officer');
							}
						});
					} else {
						res.end('You are not the guild leader.');
					}
				});
			} else if (req.body.x === 9) {
				connection.query('SELECT users_guilds.rank, users_guilds.guild, guilds.name FROM users_guilds, guilds WHERE users_guilds.user = ? AND guilds.id = ?', [req.session.userid, guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1 && results[0].rank === 3) {
						connection.query('SELECT rank FROM users_guilds WHERE user = ?', [req.body.y], function(error, results2) {
							if (error) {
								return res.end('error');
							}
							if (results2.length === 1 && results2[0].rank === 1) {
								connection.query('UPDATE users_guilds SET rank = 2 WHERE user = ? AND guild = ?', [req.body.y, results[0].guild], function(error) {
									if (error) {
										return res.end('error');
									}
									res.end('<div style="text-align:center">Promotion successful!</div><br /><div style="text-align:center">' + menu + '</div>');
								});
							} else {
								res.end('User not member');
							}
						});
					} else {
						res.end('You are not the guild leader.');
					}
				});
			} else if (req.body.x === 10) {
				connection.query('SELECT users_guilds.*, guilds.name FROM users_guilds, guilds WHERE users_guilds.user = ? AND guilds.id = ?', [req.session.userid, guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 0) {
						return res.end('error');
					}
					if (results[0].rank < 3) {
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('error');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('error');
								}
								connection.query('INSERT INTO users_guilds_logs SET ?', {
									user: req.session.userid,
									guild: results[0].guild,
									action: (req.session.username + ' left the guild')
								}, function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error');
									}
									connection.query('DELETE FROM users_guilds WHERE user = ?', [req.session.userid], function(error) {
										if (error) {
											return res.send('error');
										}
										connection.commit(function(error) {
											if (error) {
												connection.rollback();
												return res.end('database error');
											}
											connection.release();
											res.end('<div style="text-align:center">Successfully left the guild!</div>');
										});
									});
								});
							});
						});
					} else {
						connection.query('SELECT COUNT(*) AS count FROM users_guilds WHERE guild = ?', [results[0].guild], function(error, results2) {
							if (error) {
								return res.end('error');
							}
							if (results2[0].count > 1) {
								return res.end('<div style="text-align:center">Cannot leave guild while there are other members in it!</div><br /><div style="text-align:center">' + menu + '</div>');
							} else {
								connection.getConnection(function(error, connection) {
									if (error) {
										return res.end('error');
									}
									connection.beginTransaction(function(error) {
										if (error) {
											return res.end('error');
										}
										connection.query('DELETE FROM users_guilds WHERE user = ? AND guild = ?', [req.session.userid, results[0].guild], function(error) {
											if (error) {
												connection.rollback();
												return res.end('database error');
											}
											connection.query('DELETE FROM users_guilds_invites WHERE guild = ?', [results[0].guild], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('DELETE FROM guilds WHERE id = ?', [results[0].guild], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('DELETE FROM users_guilds_logs WHERE guild = ?', [results[0].guild], function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.release();
															res.end('<div style="text-align:center">Successfully deleted guild!</div>');
														});
													});
												});
											});
										});
									});
								});
							}
						});
					}
				});
			} else if (req.body.x === 11 && Number.isInteger(parseInt(req.body.y))) {
				connection.query('SELECT * FROM users_guilds_invites WHERE id = ? AND user = ?', [req.body.y, req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('SELECT COUNT(*) AS count, guilds.slots AS slots, guilds.name AS name FROM users_guilds, guilds WHERE guilds.id = ? AND users_guilds.guild = ?', [results[0].guild, results[0].guild], function(error, results2) {
							/**
							 * @param results2.slots
							 */
							if (error) {
								return res.end('error');
							}
							if (results2.length === 1 && results2[0].count < results2[0].slots) {
								connection.getConnection(function(error, connection) {
									if (error) {
										return res.end('error');
									}
									connection.beginTransaction(function(error) {
										if (error) {
											return res.end('error');
										}
										connection.query('INSERT INTO users_guilds SET ?', {
											user: req.session.userid,
											guild: results[0].guild
										}, function(error) {
											if (error) {
												connection.rollback();
												return res.end('database error');
											}
											connection.query('DELETE FROM users_guilds_invites WHERE user = ?', [req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error');
												}
												connection.query('INSERT INTO users_guilds_logs SET ?', {
													user: req.session.userid,
													guild: results[0].guild,
													action: (req.session.username + ' joined the guild')
												}, function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.commit(function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.release();
														res.end('<div style="text-align:center">Successfully joined guild!</div><br /><div style="text-align:center">' + menu + '</div>');
													});
												});
											});
										});
									});
								});
							} else {
								return res.end('<div style="text-align:center">Sorry! The guild is already full.</div>');
							}
						});
					} else {
						return res.end('You did not receive an invite from this guild');
					}
				});
			} else if (req.body.x === 12) {
				connection.query('SELECT * FROM guilds WHERE id = ?', [guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						res.write('<div style="text-align:center"><h3>Guild Settings</h3></div>');
						res.write('<div class="row"><div class="col" style="margin-left:30px;margin-right:30px;overflow-x:auto">');
						res.write('<div class="input-group mb-3"><textarea class="form-control" id="gMOTD" style="width:100% !important;" maxlength="1000">' + results[0].motd + '</textarea></div>');
						res.write('<div style="text-align:center"><input type="button" class="btn btn-outline-light border-white" value="Set MOTD" onclick="guildpage(14);"></div><br />');
						res.write('<div class="input-group mb-3"><input type="text" autocomplete="off" id="inviteUser" class="form-control border-white" placeholder="Invite player (Enter username)"><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Invite" onclick="guildpage(15);"></div></div>');
						res.write('</div></div>');
						res.write('<div class="row"><div class="col text-center">');
						res.write(menu);
						res.write('</div></div>');
						res.end();
					} else {
						res.end('?');
					}
				});
			} else if (req.body.x === 13) {
				connection.query('SELECT id FROM guilds WHERE id = ?', [guildData[0].guild], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('SELECT FROM_UNIXTIME(UNIX_TIMESTAMP(time), "%Y-%m-%d %h:%i:%s") AS time, action AS action FROM users_guilds_logs WHERE guild = ? ORDER BY id DESC LIMIT 25', [results[0].id], function(error, results2) {
							res.write('<div style="text-align:center"><h3>Guild Logs (Last 25)</h3></div>');
							res.write('<div class="row"><div class="col" style="margin-left:30px;margin-right:30px;overflow-x:auto">');
							for (let logs = 0; logs < results2.length; logs++) {
								res.write('[' + results2[logs].time + '] ' + results2[logs].action + '<br />');
							}
							res.write('</div></div>');
							res.write('<div class="row"><div class="col text-center">');
							res.write(menu);
							res.write('</div></div>');
							res.end();
						});
					} else {
						res.end('?');
					}
				});
			} else if (req.body.x === 14) {
				connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results[0].rank >= 2) {
						connection.query('UPDATE guilds SET motd = ? WHERE id = ?', [req.body.y, results[0].guild], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('<div style="text-align:center">MOTD change successful!</div><br /><div style="text-align:center">' + menu + '</div>');
						});
					} else {
						res.end('<div style="text-align:center">Only officers and leaders can change MOTD.</div><br /><div style="text-align:center">' + menu + '</div>');
					}
				});
			} else if (req.body.x === 15) {
				connection.query('SELECT guild, rank FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results[0].rank >= 2) {
						connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results2) {
							if (error) {
								return res.end('error');
							}
							if (results2.length === 1) {
								connection.query('SELECT * FROM users_guilds WHERE user = ?', [results2[0].id], function(error, results3) {
									if (error) {
										return res.end('error');
									}
									if (results3.length === 0) {
										connection.query('SELECT * FROM users_guilds_invites WHERE user = ? AND guild = ?', [results2[0].id, results[0].guild], function(error, results4) {
											if (error) {
												return res.end('error');
											}
											if (results4.length === 0) {
												connection.query('INSERT INTO users_guilds_invites SET ?', {
													user: results2[0].id,
													guild: results[0].guild
												}, function(error) {
													if (error) {
														return res.end('error');
													}
													res.end('<div style="text-align:center">Successfully invited player!</div><br /><div style="text-align:center">' + menu + '</div>');
												});
											} else {
												res.end('<div style="text-align:center">Player already has your invite!</div><br /><div style="text-align:center">' + menu + '</div>');
											}
										});
									} else {
										res.end('<div style="text-align:center">User already in guild!</div><br /><div style="text-align:center">' + menu + '</div>');
									}
								});
							} else {
								res.end('<div style="text-align:center">Player not found!</div><br /><div style="text-align:center">' + menu + '</div>');
							}
						});
					} else {
						res.end('<div style="text-align:center">Only officers and leaders can invite!</div><br /><div style="text-align:center">' + menu + '</div>');
					}
				});
			} else {
				res.end('undefined');
			}
		});
	} else {
		res.status(401).send('not logged in');
	}
};
