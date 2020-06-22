// REWRITE DONE

const connection = require('../../core/db/dbConn');
const async = require('async');
const numeral = require('numeral');

exports.settings = function(req, res) {
	if (req.session.loggedIn) {
		res.write('<div class="form-group" style="margin-right:20px;margin-left:20px">');
		res.write('<label>New Password</label><input type="password" class="form-control" id="newpass" placeholder="New Password"><br />');
		res.write('<label>Confirm New Password</label><input type="password" class="form-control" id="newpassconfirm" placeholder="Confirm New Password">');
		res.write('<br /><div class="text-center"><input type="button" class="btn btn-primary" onclick="changePass()" value="Change"></div></div><br />');
		res.write('<hr><br /><form id="avatarForm" enctype="multipart/form-data" style="margin-right:20px;margin-left:20px"><div class="form-group"><label for="avatarToUpload">Custom Avatar (Level 1000+, scaled to 200px by 200px. PNG ONLY.)</label><input type="file" class="form-control-file" id="avatarToUpload" name="avatar" required><br /><input type="submit" class="btn btn-primary btn-sm" value="Upload Image" name="submit"></div></form>');
		res.end();
	} else {
		res.send('not logged in');
	}
};

exports.inventory = function(req, res) {
	if (req.body.x) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
	}
	if (req.body.y) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.y))){
			// noinspection JSCheckFunctionSignatures
			req.body.y = parseInt(req.body.y);
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
	let menu = '<div style="text-align:center"><a href="javascript:inventory(0, 0, 0);" class="text-light">[Artifacts]</a> <a href="javascript:inventory(0, 0, 1);" class="text-light">[Misc]</a> <a href="javascript:commands(\'inventoryCount\');" class="text-light">[Space check]</a></div>';
	let heaM = 0;
	let atkM = 0;
	let defM = 0;
	let accM = 0;
	let evaM = 0;

	function getInventory() {
		connection.query('SELECT users_items.*, items.type, users.inventory, users.equipslots, users.health, users.attack, users.defense, users.accuracy, users.evasion FROM users_items, items, users WHERE users_items.user = ? AND users.id = ? AND users_items.user = users.id AND users_items.item = items.id AND items.type = "artifact" ORDER BY items.id', [req.session.userid, req.session.userid], function(error, results) {
			if (error) {
				res.send('error');
			} else if (results.length > 0) {
				let color;
				res.write(menu);
				res.write('<h3 style="margin-left:10px">Equipped Artifacts</h3><span style="margin-left:10px">(Total equip slots: ' + results[0].equipslots + ' | Total inventory slots: ' + results[0].inventory + ')</span><table class="table table-borderless text-light"><thead><tr><th scope="col">Name</th><th scope="col">Hea.</th><th scope="col">Att.</th><th scope="col">Def.</th><th scope="col">Acc.</th><th scope="col">Eva.</th><th scope="col">Actions</th></tr></thead><tbody>');
				for (let x = 0; x < results.length; x++) {
					switch (items[results[x].item - 1].rarity) {
						case 1:
							color = 'FFFFFF';
							break;
						case 2:
							color = '32CD32';
							break;
						case 3:
							color = '1E90FF';
							break;
						case 4:
							color = '9400D3';
							break;
						case 5:
							color = 'FF8C00';
							break;
						case 6:
							color = 'FF0000';
							break;
						case 7:
							color = 'FFD700';
							break;
					}
					if (results[x].equipped === 1) {
						res.write('<tr><td><a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + items[results[x].item - 1].description + '"><span style="color:#' + color + '">' + items[results[x].item - 1].name + '</span></a></td><td>' + items[results[x].item - 1].health + '</td><td>' + items[results[x].item - 1].attack + '</td><td>' + items[results[x].item - 1].defense + '</td><td>' + items[results[x].item - 1].accuracy + '</td><td>' + items[results[x].item - 1].evasion + '</td><td><a href="javascript:inventory(' + results[x].id + ',1,0);" class="text-light">[U]</a></td></tr>');
					}
				}
				res.write('</tbody></table>');
				res.write('<h3 style="margin-left:10px">Inventory</h3><table class="table table-borderless text-light"><thead><tr><th scope="col">Name</th><th scope="col">Hea.</th><th scope="col">Att.</th><th scope="col">Def.</th><th scope="col">Acc.</th><th scope="col">Eva.</th><th scope="col">Actions</th></tr></thead><tbody>');
				for (let x = 0; x < results.length; x++) {
					switch (items[results[x].item - 1].rarity) {
						case 1:
							color = 'FFFFFF';
							break;
						case 2:
							color = '32CD32';
							break;
						case 3:
							color = '1E90FF';
							break;
						case 4:
							color = '9400D3';
							break;
						case 5:
							color = 'FF8C00';
							break;
						case 6:
							color = 'FF0000';
							break;
						case 7:
							color = 'FFD700';
							break;
					}
					if (results[x].equipped === 0) {
						res.write('<tr><td><a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + items[results[x].item - 1].description + '"><span style="color:#' + color + '">' + items[results[x].item - 1].name + '</span></a></td><td>' + items[results[x].item - 1].health + '</td><td>' + items[results[x].item - 1].attack + '</td><td>' + items[results[x].item - 1].defense + '</td><td>' + items[results[x].item - 1].accuracy + '</td><td>' + items[results[x].item - 1].evasion + '</td><td><a href="javascript:inventory(' + results[x].id + ',1,0);" class="text-light">[E]</a> <a href="javascript:inventory(' + results[x].id + ',2,0);" class="text-danger">[D]</a></td></tr>');
					}
				}
				res.write('</tbody></table>[BREAK]');
				res.write(numeral(results[0].health).format('0,0') + ' (' + numeral(heaM).format('0,0') + ')[BREAK]' + numeral(results[0].attack).format('0,0') + ' (' + numeral(atkM).format('0,0') + ')[BREAK]' + numeral(results[0].defense).format('0,0') + ' (' + numeral(defM).format('0,0') + ')[BREAK]' + ((results[0].accuracy + 5000) / 100) + '% (' + ((accM + 5000) / 100) + '%)[BREAK]' + (results[0].evasion / 100) + '% (' + ((accM + 5000) / 100) + '%)');
				res.end();
			} else {
				res.write('<div style="text-align:center">No artifacts found.</div>[BREAK]');
				res.write(numeral(results[0].health).format('0,0') + ' (' + numeral(heaM).format('0,0') + ')[BREAK]' + numeral(results[0].attack).format('0,0') + ' (' + numeral(atkM).format('0,0') + ')[BREAK]' + numeral(results[0].defense).format('0,0') + ' (' + numeral(defM).format('0,0') + ')[BREAK]' + ((results[0].accuracy + 5000) / 100) + '% (' + ((accM + 5000) / 100) + '%)[BREAK]' + (results[0].evasion / 100) + '% (' + ((accM + 5000) / 100) + '%)');
				res.end();
			}
		});
	}

	function upStats() {
		connection.query('SELECT users_items.user AS user, users_items.equipped AS equipped, users_items.item AS item, items.health AS health, items.attack AS attack, items.defense AS defense, items.accuracy AS accuracy, items.evasion AS evasion FROM users_items, items WHERE users_items.user = ? AND users_items.equipped = 1 AND users_items.item = items.id', [req.session.userid, req.session.userid], function(error, results) {
			async.forEachOf(results, function(result, x, callback) {
				heaM += results[x].health;
				atkM += results[x].attack;
				defM += results[x].defense;
				accM += results[x].accuracy;
				evaM += results[x].evasion;
				callback();
			}, function(err) {
				if (err) {
					res.end('err');
				}
				if (heaM < 0) {
					heaM = 0;
				}
				if (atkM < 0) {
					atkM = 0;
				}
				if (defM < 0) {
					defM = 0;
				}
				if (accM < 0) {
					accM = 0;
				}
				if (evaM < 0) {
					evaM = 0;
				}
				connection.query('SELECT health, attack, defense, accuracy, evasion FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					heaM += results[0].health;
					atkM += results[0].attack;
					defM += results[0].defense;
					accM += results[0].accuracy;
					evaM += results[0].evasion;
					getInventory();
				});
			});
		});
	}

	if (req.session.loggedIn) {
		if (req.body.x === 0 && req.body.z === 0) {
			upStats();
		} else if (req.body.z === 1) {
			connection.query('SELECT users_items.*, items.type FROM users_items, items WHERE users_items.user = ? AND users_items.item = items.id AND items.type = "misc" ORDER BY items.id', [req.session.userid], function(error, results) {
				if (error) {
					res.send('error');
				} else if (results.length > 0) {
					/**
					 * @param items.rarity -  Mainly for changing colors
					 */
					let color;
					res.write(menu);
					res.write('<h3 style="margin-left:10px">Inventory</h3><table class="table table-borderless text-light"><thead><tr><th scope="col">Name</th><th scope="col">Quantity</th><th scope="col">Actions</th></tr></thead><tbody>');
					for (let x = 0; x < results.length; x++) {
						switch (items[results[x].item - 1].rarity) {
							case 1:
								color = 'FFFFFF';
								break;
							case 2:
								color = '32CD32';
								break;
							case 3:
								color = '1E90FF';
								break;
							case 4:
								color = '9400D3';
								break;
							case 5:
								color = 'FF8C00';
								break;
							case 6:
								color = 'FF0000';
								break;
							case 7:
								color = 'FFD700';
								break;
						}
						if (results[x].equipped === 0) {
							res.write('<tr><td><a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + items[results[x].item - 1].description + '"><span style="color:#' + color + '">' + items[results[x].item - 1].name + '</span></a></td><td>x' + results[x].quantity + '</td><td><a href="javascript:inventory(' + results[x].id + ',2,0);" class="text-danger">[D]</a></td></tr>');
						}
					}
					res.write('</tbody></table>[BREAK]');
					res.end();
				} else {
					res.write('<div style="text-align:center">No misc items found.</div>[BREAK]');
					res.end();
				}
			});
		} else if (req.body.x > 0 && req.body.y === 1 && req.body.z === 0) {
			connection.query('SELECT equipslots FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				let equipSlots = results[0].equipslots;
				connection.getConnection(function(error, connection) {
					if (error) {
						return res.end('error');
					}
					connection.beginTransaction(function(error) {
						if (error) {
							return res.end('error');
						}
						connection.query('SELECT * FROM users_items WHERE user = ? AND id = ? FOR UPDATE', [req.session.userid, req.body.x], function(error, results) {
							if (error) {
								connection.rollback();
								return res.end('server error.');
							} else if (results.length === 1 && items[results[0].item - 1].type === 'artifact') {
								connection.query('UPDATE users_items SET equipped = NOT equipped WHERE id = ?', [req.body.x], function(error) {
									if (error) {
										connection.rollback();
										return res.end('server error.');
									} else {
										connection.query('SELECT users_items.user AS user, users_items.equipped AS equipped, users_items.item AS item, items.health AS health, items.attack AS attack, items.defense AS defense, items.accuracy AS accuracy, items.evasion AS evasion FROM users_items, items WHERE users_items.user = ? AND users_items.equipped = 1 AND users_items.item = items.id', [req.session.userid], function(error, results) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											} else {
												if (results.length > equipSlots) {
													connection.query('UPDATE users_items SET equipped = NOT equipped WHERE id = ?', [req.body.x], function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														} else {
															connection.commit(function(error) {
																if (error) {
																	connection.rollback();
																	return res.end('server error.');
																}
																connection.release();
																res.write('<h3 class="text-danger">NOT ENOUGH EQUIP SLOTS</h3>');
																upStats();
															});
														}
													});
												} else {
													connection.commit(function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														}
														connection.release();
														upStats();
													});
												}
											}
										});
									}
								});
							} else {
								connection.rollback();
								return res.end('<h3 class="text-danger">ITEM NOT IN INVENTORY</h3>');
							}
						});
					});
				});
			});
		} else if (req.body.x > 0 && req.body.y === 2) {
			connection.getConnection(function(error, connection) {
				if (error) {
					return res.end('error');
				}
				connection.beginTransaction(function(error) {
					if (error) {
						return res.end('error');
					}
					connection.query('SELECT * FROM users_items WHERE user = ? AND id = ? AND equipped = 0 FOR UPDATE', [req.session.userid, req.body.x], function(error, results) {
						if (error) {
							connection.rollback();
							return res.end('server error.');
						}
						if (results.length === 1) {
							connection.query('DELETE FROM users_items WHERE user = ? AND id = ?', [req.session.userid, req.body.x], function(error) {
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
									upStats();
								});
							});
						} else {
							connection.commit(function(error) {
								if (error) {
									connection.rollback();
									return res.end('server error.');
								}
								connection.release();
								upStats();
							});
						}
					});
				});
			});
		} else {
			res.send('unknown request');
		}
	} else {
		res.send('not logged in');
	}
};

exports.mapMove = function(req, res) {
	if (req.body.x) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
	}
	let funcP2;
	let placeString = '';
	if (req.session.loggedIn) {
		connection.query('SELECT location, locationx, locationy FROM users WHERE id = ?', [req.session.userid], function(error, result) {
			if (error) {
				return res.end('error');
			}
			if (req.body.x === 1) {
				if (result[0].locationy < locations[result[0].location - 1].distancey) {
					connection.query('UPDATE users SET locationy = locationy + 1 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						} else {
							result[0].locationy++;
							let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
							funcP2 = arrayIt.filter(function(special) {
								return special.location === result[0].location &&
									special.locationx === result[0].locationx &&
									special.locationy === result[0].locationy;
							});
							if (funcP2.length > 0) {
								if ((funcP2[0].function).split(' ')[0] === 'enter') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="toPlace(' + funcP3 + ')" value="Portal to ' + locations[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								} else if ((funcP2[0].function).split(' ')[0] === 'shop') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="openpage(7, ' + funcP3 + ')" value="Access ' + shops[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								}
							}
							res.send('<span id="bgChange" style="display:none;">' + result[0].location + '</span>' + locations[result[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[result[0].location - 1].description + '">[?]</a><br />' + placeString + result[0].locationx + ' , ' + result[0].locationy);
						}
					});
				} else {
					res.send('Cannot go any further!');
				}
			} else if (req.body.x === 2) {
				/**
				 * @param locations.distancex = X distance coord
				 * @param locations.distancey = Y distance coord
				 */
				if (result[0].locationx < locations[result[0].location - 1].distancex) {
					connection.query('UPDATE users SET locationx = locationx + 1 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						} else {
							result[0].locationx++;
							let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
							funcP2 = arrayIt.filter(function(special) {
								return special.location === result[0].location &&
									special.locationx === result[0].locationx &&
									special.locationy === result[0].locationy;
							});
							if (funcP2.length > 0) {
								if ((funcP2[0].function).split(' ')[0] === 'enter') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="toPlace(' + funcP3 + ')" value="Portal to ' + locations[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								} else if ((funcP2[0].function).split(' ')[0] === 'shop') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="openpage(7, ' + funcP3 + ')" value="Access ' + shops[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								}
							}
							res.send('<span id="bgChange" style="display:none;">' + result[0].location + '</span>' + locations[result[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[result[0].location - 1].description + '">[?]</a><br />' + placeString + result[0].locationx + ' , ' + result[0].locationy);
						}
					});
				} else {
					res.send('Cannot go any further!');
				}
			} else if (req.body.x === 3) {
				if (result[0].locationy > 0) {
					connection.query('UPDATE users SET locationy = locationy - 1 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						} else {
							result[0].locationy--;
							let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
							funcP2 = arrayIt.filter(function(special) {
								return special.location === result[0].location &&
									special.locationx === result[0].locationx &&
									special.locationy === result[0].locationy;
							});
							if (funcP2.length > 0) {
								if ((funcP2[0].function).split(' ')[0] === 'enter') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="toPlace(' + funcP3 + ')" value="Portal to ' + locations[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								} else if ((funcP2[0].function).split(' ')[0] === 'shop') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="openpage(7, ' + funcP3 + ')" value="Access ' + shops[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								}
							}
							res.send('<span id="bgChange" style="display:none;">' + result[0].location + '</span>' + locations[result[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[result[0].location - 1].description + '">[?]</a><br />' + placeString + result[0].locationx + ' , ' + result[0].locationy);
						}
					});
				} else {
					res.send('Cannot go any further!');
				}
			} else if (req.body.x === 4) {
				if (result[0].locationx > 0) {
					connection.query('UPDATE users SET locationx = locationx - 1 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						} else {
							result[0].locationx--;
							let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
							funcP2 = arrayIt.filter(function(special) {
								return special.location === result[0].location &&
									special.locationx === result[0].locationx &&
									special.locationy === result[0].locationy;
							});
							if (funcP2.length > 0) {
								if ((funcP2[0].function).split(' ')[0] === 'enter') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="toPlace(' + funcP3 + ')" value="Portal to ' + locations[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								} else if ((funcP2[0].function).split(' ')[0] === 'shop') {
									let funcP3 = (funcP2[0].function).split(' ')[1];
									placeString = '<input type="button" onclick="openpage(7, ' + funcP3 + ')" value="Access ' + shops[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
								}
							}
							res.send('<span id="bgChange" style="display:none;">' + result[0].location + '</span>' + locations[result[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[result[0].location - 1].description + '">[?]</a><br />' + placeString + result[0].locationx + ' , ' + result[0].locationy);
						}
					});
				} else {
					res.send('Cannot go any further!');
				}
			} else {
				let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
				funcP2 = arrayIt.filter(function(special) {
					return special.location === result[0].location &&
						special.locationx === result[0].locationx &&
						special.locationy === result[0].locationy;
				});
				if (funcP2.length > 0) {
					if ((funcP2[0].function).split(' ')[0] === 'enter') {
						let funcP3 = (funcP2[0].function).split(' ')[1];
						placeString = '<input type="button" onclick="toPlace(' + funcP3 + ')" value="Portal to ' + locations[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
					} else if ((funcP2[0].function).split(' ')[0] === 'shop') {
						let funcP3 = (funcP2[0].function).split(' ')[1];
						placeString = '<input type="button" onclick="openpage(7, ' + funcP3 + ')" value="Access ' + shops[funcP3 - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />';
					}
				}
				res.send('<span id="bgChange" style="display:none;">' + result[0].location + '</span>' + locations[result[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[result[0].location - 1].description + '">[?]</a><br />' + placeString + result[0].locationx + ' , ' + result[0].locationy);
			}
		});
	} else {
		res.send('not logged in');
	}
};

exports.teleportList = function(req, res) {
	if (req.session.loggedIn) {
		connection.query('SELECT level FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
			if (error) {
				return res.end(error);
			}
			connection.query('SELECT * FROM locations WHERE level <= ?', [userData[0].level], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				res.write('<br /><p class="text-center">Pay 1 platinum to teleport to the (0, 0) start of a location.</p>');
				res.write('<div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><div class="input-group mb-3" style="text-align:center"><select id="teleportList" class="form-control text-white" style="background-color: rgba(0, 0, 0, 0.3);">');
				for (let x = 0; x < results.length; x++) {
					res.write('<option value="' + results[x].id + '">' + results[x].name + '</option>');
				}
				res.write('</select><div class="input-group-append"><input type="button" id="teleb" class="btn btn-outline-light border-white" value="Teleport" onclick="teleport();"></div></div></div></div>');
				res.end();
			});
		});
	} else {
		res.send('not logged in');
	}
};

exports.milestones = function(req, res) {
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
		connection.query('SELECT gold, credits, mithril FROM users WHERE id = ?', [req.session.userid], function(error, uResults) {
			let milestoneCurrency = '[BREAK]' + uResults[0].gold + '[BREAK]' + uResults[0].credits + '[BREAK]' + uResults[0].mithril;
			let menu = '<div style="text-align:center"><input type="button" onclick="milestones(1)" value="Incomplete" class="btn btn-outline-light border-white btn-sm"> <input type="button" onclick="milestones(2)" value="Completed" class="btn btn-outline-light border-white btn-sm"></div>';
			if (req.body.x === 1) {
				connection.query('SELECT * FROM milestones WHERE id NOT IN (SELECT milestone FROM users_milestones WHERE user = ?)', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write(menu);
					res.write('<div style="text-align:center"><small>Click "Complete" if you have reached the milestone for rewards!</small></div><br />');
					res.write('<div class="container-fluid"><div class="row" style="margin-left:20px;padding-left:10px;">');
					if (results.length > 0) {
						for (let y = 0; y < results.length; y++) {
							res.write('<div class="col-sm-5" style="min-width:11rem;"><div class="card text-white bg-dark" style="height:135px;width:11rem;border-radius:0.25rem;margin-bottom:10px;border: 2px solid white"><div class="card-body"><h6 class="card-title text-center">' + results[y].name + '</h6><p class="card-text text-center">' + results[y].description + '</p><div style="text-align:center"><input type="button" class="btn btn-light" onclick="milestones(3, ' + results[y].id + ')" value="Complete"></div></div></div></div>');
						}
					} else {
						res.write('<div style="text-align:center">It appears that you have completed all the milestones.</div>');
					}
					res.write('</div></div>' + milestoneCurrency);
					res.end();
				});
			} else if (req.body.x === 2) {
				connection.query('SELECT * FROM milestones WHERE id IN (SELECT milestone FROM users_milestones WHERE user = ?)', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write(menu);
					res.write('<div style="text-align:center"><small>Click "Complete" if you have reached the milestone for rewards!</small></div><br />');
					res.write('<div class="container-fluid"><div class="row" style="margin-left:20px;padding-left:10px;">');
					if (results.length > 0) {
						for (let y = 0; y < results.length; y++) {
							res.write('<div class="col-sm-5" style="min-width:11rem;"><div class="card text-white bg-dark" style="height:135px;width:11rem;border-radius:0.25rem;margin-bottom:10px;border 2px solid white"><div class="card-body"><h6 class="card-title text-center">' + results[y].name + '</h6><p class="card-text text-center">' + results[y].description + '</p><div style="text-align:center"><input type="button" class="btn btn-dark" value="Completed" disabled></div></div></div></div>');
						}
					} else {
						res.write('<div style="text-align:center">You have no completed milestones yet.</div>');
					}
					res.write('</div></div>' + milestoneCurrency);
					res.end();
				});
			} else if (req.body.x === 3) {
				if (Number.isInteger(parseInt(req.body.y))) {
					connection.query('SELECT * FROM milestones WHERE id = ?', [req.body.y], function(error, results) {
						if (error) {
							return res.end('database error');
						}
						if (results.length === 1) {
							connection.query('SELECT * FROM users_milestones WHERE user = ? AND milestone = ?', [req.session.userid, req.body.y], function(error, checker) {
								if (error) {
									return res.end('database error');
								}
								if (checker.length > 0) {
									return res.end(menu + '<div style="text-align:center">You already redeemed for this milestone!</div>');
								}
								if (results[0].type === 'level') {
									connection.query('SELECT level FROM users WHERE id = ?', [req.session.userid], function(error, results2) {
										if (error) {
											return res.end('database error');
										}
										if (results2[0].level >= results[0].required) {
											connection.getConnection(function(error, connection) {
												if (error) {
													return res.end('error');
												}
												connection.beginTransaction(function(error) {
													if (error) {
														return res.end('error');
													}
													connection.query('UPDATE users SET gold = gold + ?, credits = credits + ?, mithril = mithril + ? WHERE id = ?', [results[0].gold, results[0].credits, results[0].mithril, req.session.userid], function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														}
														connection.query('INSERT INTO users_milestones SET ?', {
															user: req.session.userid,
															milestone: results[0].id
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
																res.end(menu + '<div style="text-align:center">Completed milestone and received <b>' + results[0].gold + '</b> gold, <b>' + results[0].credits + '</b> credits, and <b>' + results[0].mithril + '</b> mithril</div>' + milestoneCurrency);
															});
														});
													});
												});
											});
										} else {
											return res.end(menu + '<div style="text-align:center">Your level is not high enough for this milestone.</div>' + milestoneCurrency);
										}
									});
								} else {
									connection.query('SELECT kills FROM users WHERE id = ?', [req.session.userid], function(error, results2) {
										if (error) {
											return res.end('database error');
										}
										if (results2[0].kills >= results[0].required) {
											connection.getConnection(function(error, connection) {
												if (error) {
													return res.end('error');
												}
												connection.beginTransaction(function(error) {
													if (error) {
														return res.end('error');
													}
													connection.query('UPDATE users SET gold = gold + ?, credits = credits + ?, mithril = mithril + ? WHERE id = ?', [results[0].gold, results[0].credits, results[0].mithril, req.session.userid], function(error) {
														if (error) {
															connection.rollback();
															return res.end('server error.');
														}
														connection.query('INSERT INTO users_milestones SET ?', {
															user: req.session.userid,
															milestone: results[0].id
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
																res.end(menu + '<div style="text-align:center">Completed milestone and received <b>' + results[0].gold + '</b> gold, <b>' + results[0].credits + '</b> credits, and <b>' + results[0].mithril + '</b> mithril</div>' + milestoneCurrency);
															});
														});
													});
												});
											});
										} else {
											return res.end(menu + '<div style="text-align:center">Your kill count is not high enough for this milestone.</div>' + milestoneCurrency);
										}
									});
								}
							});
						} else {
							res.end('Invalid milestone.' + milestoneCurrency);
						}
					});
				} else {
					res.end('No.' + milestoneCurrency);
				}
			} else {
				res.end('undefined');
			}
		});
	} else {
		res.send('not logged in');
	}
};
