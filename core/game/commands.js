// REWRITE DONE

const connection = require('../../core/db/dbConn');
const bcrypt = require('bcrypt');
const numeral = require('numeral');
const toCoin = require('../../core/utils/coins');
exports.commands = function(req, res) {
	if (req.session.loggedIn) {
		if (req.body.x === 'online') {
			connection.query('SELECT COUNT(*) AS total FROM sessions', function(error, results) {
				if (error) {
					return res.end('error');
				}
				res.send((results[0].total).toString());
			});
		} else if (req.body.x === 'inventoryCount') {
			connection.query('SELECT inventory FROM users WHERE id = ?', [req.session.userid], function(error, uInv) {
				if (error) {
					return res.end('error');
				}
				connection.query('SELECT COUNT(*) AS count FROM users_items WHERE user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					res.end('<div class="chatline">Your inventory space: <b class="text-primary">' + results[0].count + '/' + uInv[0].inventory + '</b></div>');
				});
			});
		} else if (req.body.x === 'ban') {
			if (req.session.access >= 40) {
				connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('UPDATE users SET access = 0 WHERE username = ?', [req.body.y], function(error) {
							if (error) {
								return res.end('error');
							}
							connection.query('DELETE FROM sessions WHERE LOWER(data) REGEXP \',"username":"' + (req.body.y).replace(/[^a-z0-9]/gi, '') + '","level"\'', function(error) {
								if (error) {
									return res.end('error');
								}
								res.end('<div class="chatline">' + req.body.y + ' has been banned.</div>');
							});
						});
					} else {
						res.end('<div class="chatline">User does not exist.</div>');
					}
				});
			} else {
				res.end('<div class="chatline">I think you have to be a staff member to ban people.</div>');
			}
		} else if (req.body.x === 'mute') {
			if (req.session.access >= 40) {
				connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('UPDATE users SET muted = 1 WHERE username = ?', [req.body.y], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('<div class="chatline">' + req.body.y + ' has been muted.</div>');
						});
					} else {
						res.end('<div class="chatline">User does not exist.</div>');
					}
				});
			} else {
				res.end('<div class="chatline">I think you have to be a staff member to mute people.</div>');
			}
		} else if (req.body.x === 'unmute') {
			if (req.session.access >= 40) {
				connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('UPDATE users SET muted = 0 WHERE username = ?', [req.body.y], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('<div class="chatline">' + req.body.y + ' has been unmuted.</div>');
						});
					} else {
						res.end('<div class="chatline">User does not exist.</div>');
					}
				});
			} else {
				res.end('<div class="chatline">I think you have to be a staff member to unmute people.</div>');
			}
		} else if (req.body.x === 'kick') {
			if (req.session.access >= 40) {
				connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.query('DELETE FROM sessions WHERE LOWER(data) REGEXP \',"username":"' + (req.body.y).replace(/[^a-z0-9]/gi, '') + '","level"\'', function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('<div class="chatline">' + req.body.y + ' has been kicked from the game.</div>');
						});
					} else {
						res.end('<div class="chatline">User does not exist.</div>');
					}
				});
			} else {
				res.end('<div class="chatline">I think you have to be a staff member to kick people.</div>');
			}
		} else if (req.body.x === 'clear') {
			if (req.session.access >= 60) {
				connection.query('SELECT * FROM monsters', function(error, results) {
					if (error) {
						return res.end('error');
					}
					console.log('[MYSQL] Reloaded monsters');
					global.monsters = results;
					connection.query('SELECT * FROM items', function(error, results) {
						if (error) {
							return res.end('error');
						}
						console.log('[MYSQL] Reloaded items');
						global.items = results;
						connection.query('SELECT * FROM monsters_drops', function(error, results) {
							if (error) {
								return res.end('error');
							}
							console.log('[MYSQL] Reloaded monster drops');
							global.mondrops = results;
							connection.query('SELECT * FROM settings', function(error, results) {
								if (error) {
									return res.end('error');
								}
								console.log('[MYSQL] Reloaded game settings');
								global.gsettings = results;
								connection.query('SELECT * FROM locations', function(error, results) {
									if (error) {
										return res.end('error');
									}
									console.log('[MYSQL] Reloaded locations');
									global.locations = results;
									connection.query('SELECT * FROM locations_places', function(error, results) {
										if (error) {
											return res.end('error');
										}
										console.log('[MYSQL] Reloaded location places');
										global.locPlaces = results;
										connection.query('SELECT * FROM beasts', function(error, results) {
											if (error) {
												return res.end('error');
											}
											console.log('[MYSQL] Reloaded beasts');
											global.beasts = results;
											connection.query('SELECT * FROM story', function(error, results) {
												if (error) {
													return res.end('error');
												}
												console.log('[MYSQL] Reloaded story');
												story = results;
												connection.query('SELECT * FROM reputation_ranks', function(error, results) {
													if (error) {
														return res.end('error');
													}
													console.log('[MYSQL] Reloaded reputation ranks');
													global.reputation_ranks = results;
													connection.query('SELECT * FROM shops', function(error, results) {
														if (error) {
															return res.end('error');
														}
														console.log('[MYSQL] Reloaded shops');
														global.shops = results;
														connection.query('SELECT * FROM shops_items', function(error, results) {
															if (error) {
																return res.end('error');
															}
															console.log('[MYSQL] Reloaded shop items');
															global.shopitems = results;
															connection.query('SELECT * FROM items_requirements', function(error, results) {
																if (error) {
																	return res.end('error');
																}
																console.log('[MYSQL] Reloaded item requirements');
																global.itemreqs = results;
																res.end('<div class="chatline">Successfully reloaded all server settings.</div>');
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			} else {
				res.end('<div class="chatline">Why would a player need to clear server settings?</div>');
			}
		} else if (req.body.x === 'clearchat') {
			if (req.session.access >= 60) {
				connection.query('DELETE FROM chat_messages', function(error) {
					if (error) {
						return res.end('database error');
					}
					res.end('<div class="chatline">The chat has been purged. Welp, there goes all the evidence.</div>');
				});
			} else {
				res.end('<div class="chatline">No.</div>');
			}
		} else {
			res.end('<div class="chatline">?</div>');
		}
	} else {
		res.end('not logged in');
	}
};

exports.toPlace = function(req, res) {
	/**
	 * @param location.function
	 * @param location.reqitem
	 */
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
		connection.query('SELECT * FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
			if (error) {
				return res.end('error');
			}
			let placeToGo = req.body.x;
			let arrayIt = JSON.parse(JSON.stringify((locPlaces)));
			let funcP1 = arrayIt.filter(function(special) {
				return special.location === userData[0].location &&
					special.locationx === userData[0].locationx &&
					special.locationy === userData[0].locationy;
			});
			if (funcP1.length === 1 && userData[0].level >= locations[placeToGo - 1].level) {
				if (locations[placeToGo - 1].reqitem > 0) {
					connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [locations[funcP1[0].location - 1].reqitem, req.session.userid], function(error, results) {
						if (error) {
							return res.end('database error, refresh page');
						}
						if (results.length === 1) {
							let funcP2 = (funcP1[0].function).split(' ')[1];
							let funcP3 = arrayIt.filter(function(special) {
								return special.location === parseInt(funcP2) &&
									special.function === 'enter ' + funcP1[0].location;
							});
							connection.query('UPDATE users SET location = ?, locationx = ?, locationy = ? WHERE id = ?', [funcP2, funcP3[0].locationx, funcP3[0].locationy, req.session.userid], function(error) {
								if (error) {
									return error;
								} else {
									res.send('<span id="bgChange" style="display:none;">' + locations[funcP2 - 1].id + '</span>' + locations[funcP2 - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[funcP2 - 1].description + '">[?]</a><br /><input type="button" onclick="toPlace(' + funcP2 + ')" value="Portal to ' + locations[funcP1[0].location - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />' + funcP3[0].locationx + ' , ' + funcP3[0].locationy);
								}
							});
						} else {
							res.send('<span id="bgChange" style="display:none;">' + locations[userData[0].location - 1].id + '</span><span class="text-danger">Required item: </span>' + items[locations[placeToGo - 1].reqitem - 1].name + '<br />' + locations[userData[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[userData[0].location - 1].description + '">[?]</a><br /><input type="button" onclick="toPlace(' + placeToGo + ')" value="Portal to ' + locations[placeToGo - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />' + userData[0].locationx + ' , ' + userData[0].locationy);
						}
					});
				} else {
					let funcP2 = (funcP1[0].function).split(' ')[1];
					let funcP3 = arrayIt.filter(function(special) {
						return special.location === parseInt(funcP2) &&
							special.function === 'enter ' + funcP1[0].location;
					});
					connection.query('UPDATE users SET location = ?, locationx = ?, locationy = ? WHERE id = ?', [funcP2, funcP3[0].locationx, funcP3[0].locationy, req.session.userid], function(error) {
						if (error) {
							return error;
						} else {
							res.send('<span id="bgChange" style="display:none;">' + locations[funcP2 - 1].id + '</span>' + locations[funcP2 - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[funcP2 - 1].description + '">[?]</a><br /><input type="button" onclick="toPlace(' + funcP2 + ')" value="Portal to ' + locations[funcP1[0].location - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />' + funcP3[0].locationx + ' , ' + funcP3[0].locationy);
						}
					});
				}
			} else {
				res.send('<span id="bgChange" style="display:none;">' + locations[userData[0].location - 1].id + '</span><span class="text-danger">Req Level: </span>' + locations[placeToGo - 1].level + '<br />' + locations[userData[0].location - 1].name + ' <a rel="popover" data-trigger="hover click" data-placement="bottom" title="' + locations[userData[0].location - 1].description + '">[?]</a><br /><input type="button" onclick="toPlace(' + placeToGo + ')" value="Portal to ' + locations[placeToGo - 1].name + '" class="btn btn-outline-light border-white btn-sm"><br />' + userData[0].locationx + ' , ' + userData[0].locationy);
			}
		});
	} else {
		res.end('not logged in');
	}
};

exports.teleportBeast = function(req, res) {
	if (req.session.loggedIn) {
		connection.query('SELECT * FROM locations_beasts ORDER BY id DESC LIMIT 1', function(error, results) {
			if (error) {
				return res.end('database error');
			}
			if (results.length > 0) {
				connection.query('SELECT level, gold FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
					if (error) {
						return res.end('error');
					}
					if (locations[results[0].location - 1].level > userData[0].level) {
						return res.end('Level not high enough![BREAK]' + userData[0].gold);
					}
					if (locations[results[0].location - 1].reqitem > 0) {
						connection.query('SELECT * FROM users_items WHERE user = ? AND item = ?', [locations[results[0].location - 1].reqitem, req.session.userid], function(error, results2) {
							if (error) {
								return res.end('database error');
							}
							if (results2.length === 1) {
								if (userData[0].gold >= 1500000) {
									connection.query('UPDATE users SET gold = gold - 1500000, location = ?, locationx = ?, locationy = ? WHERE id = ?', [results[0].location, results[0].locationx, results[0].locationy, req.session.userid], function(error) {
										if (error) {
											return res.end('database error');
										}
										res.end('Successfully teleported to the most recent beast.[BREAK]' + (userData[0].gold - 1500000));
									});
								} else {
									return res.end('not enough gold');
								}
							} else {
								return res.end('You do not have required item to access the location![BREAK]' + userData[0].gold);
							}
						});
					} else {
						if (userData[0].gold >= 1500000) {
							connection.query('UPDATE users SET gold = gold - 1500000, location = ?, locationx = ?, locationy = ? WHERE id = ?', [results[0].location, results[0].locationx, results[0].locationy, req.session.userid], function(error) {
								if (error) {
									return res.end('database error');
								}
								res.end('Successfully teleported to the most recent beast.[BREAK]' + (userData[0].gold - 1500000));
							});
						} else {
							return res.end('not enough gold[BREAK]' + userData[0].gold);
						}
					}
				});
			} else {
				res.end('No live beasts');
			}
		});
	} else {
		res.end('not logged in');
	}
};

exports.teleportLoc = function(req, res) {
	if (req.session.loggedIn) {
		if (Number.isInteger(parseInt(req.body.x)) && req.body.x <= locations.length) {
			connection.query('SELECT gold, location FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
				if (error) {
					return res.end('error');
				}
				if (locations[req.body.x - 1].id === userData[0].location) {
					return res.end('You are already at this location![BREAK]' + userData[0].gold);
				} else {
					if (locations[req.body.x - 1].reqitem > 0) {
						connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [locations[req.body.x - 1].reqitem, req.session.userid], function(error, results) {
							if (error) {
								return res.end('database error');
							}
							if (results.length === 1 && userData[0].gold >= 1000000) {
								connection.query('UPDATE users SET gold = gold - 1000000, location = ?, locationx = 0, locationy = 0 WHERE id = ?', [req.body.x, req.session.userid], function(error) {
									if (error) {
										return res.end('database error');
									}
									res.end('Successfully teleported to selected location.[BREAK]' + (userData[0].gold - 1000000));
								});
							} else if (results.length === 0) {
								res.end('Required item to teleport to selected location is not in your inventory.[BREAK]' + userData[0].gold);
							} else {
								res.end('Not enough gold to teleport.[BREAK]' + userData[0].gold);
							}
						});
					} else {
						if (userData[0].gold >= 1000000) {
							connection.query('UPDATE users SET gold = gold - 1000000, location = ?, locationx = 0, locationy = 0 WHERE id = ?', [req.body.x, req.session.userid], function(error) {
								if (error) {
									return res.end('database error');
								}
								res.end('Successfully teleported to selected location.[BREAK]' + (userData[0].gold - 1000000));
							});
						} else {
							res.end('Not enough gold to teleport.[BREAK]' + userData[0].gold);
						}
					}
				}
			});
		} else {
			res.end('undefined location[BREAK]');
		}
	} else {
		res.end('not logged in');
	}
};

exports.passwordChange = function(req, res) {
	if (req.session.loggedIn) {
		if ((req.body.password).length >= 6) {
			let hashedPassword = bcrypt.hashSync(req.body.password, 6);
			connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.userid], function(error) {
				if (error) {
					return res.end('Failed to change password: Database error.');
				}
				res.end('Successfully changed password.');
			});
		} else {
			res.end('Password not long enough!');
		}
	} else {
		res.end('not logged in');
	}
};

exports.redeemCode = function(req, res) {
	if (req.session.loggedIn) {
		if (!req.body.x) {
			return res.status(401).end('<b class="text-danger">No code entered</b>');
		}
		connection.query('SELECT * FROM redeems WHERE code = ?', [req.body.x], function(error, results) {
			if (error) {
				return res.status(401).end('database error');
			} else if (results.length < 1) {
				return res.status(401).end('<b class="text-danger">Invalid code</b>');
			} else {
				if (new Date(results[0].expires) < new Date()) {
					return res.end('<b class="text-danger">This code has expired</b>');
				} else {
					connection.query('SELECT * FROM users_redeems WHERE user = ? AND redeem = ?', [req.session.userid, results[0].id], function(error, results2) {
						if (error) {
							return res.end('database error');
						}
						if (results2.length > 0) {
							return res.status(401).end('<b class="text-danger">Already redeemed this code</b>');
						} else {
							connection.query('SELECT level, gold, credits, mithril FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
								if (error) {
									return res.end('error');
								}
								if (results[0].type === 'level') {
									if (userData[0].level >= results[0].required) {
										connection.getConnection(function(error, connection) {
											if (error) {
												return res.end('server error.');
											}
											connection.beginTransaction(function(error) {
												if (error) {
													return res.end('server error.');
												}
												connection.query('UPDATE users SET gold = gold + ?, credits = credits + ?, mithril = mithril + ? WHERE id = ?', [results[0].gold, results[0].credits, results[0].mithril, req.session.userid], function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error');
													}
													connection.query('INSERT INTO users_redeems SET ?', {
														user: req.session.userid,
														redeem: results[0].id
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.release();
															res.end('<b class="text-success">Received ' + toCoin(results[0].gold) + ' coins, ' + numeral(results[0].credits).format('0,0') + ' credits, and ' + numeral(results[0].mithril).format('0,0') + ' mithril</b>' + '[BREAK]' + (results[0].gold + userData[0].gold) + '[BREAK]' + (results[0].credits + userData[0].credits) + '[BREAK]' + (results[0].mithril + userData[0].mithril));
														});
													});
												});
											});
										});
									} else {
										res.end('<b class="text-danger">Level requirement not met for code</b>' + '[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits + '[BREAK]' + userData[0].mithril);
									}
								} else if (results[0].type === 'referral') {
									connection.query('SELECT COUNT(DISTINCT ipaddress) AS count FROM users WHERE level >= 100 AND referrer = ? AND (created between DATE_FORMAT(NOW() ,"%Y-%m-01") AND NOW())', [req.session.userid], function(error, results2) {
										if (error) {
											return res.end('error');
										}
										if (results2[0].count >= results[0].required) {
											connection.getConnection(function(error, connection) {
												if (error) {
													return res.end('server error.');
												}
												connection.beginTransaction(function(error) {
													if (error) {
														return res.end('server error.');
													}
													connection.query('UPDATE users SET gold = gold + ?, credits = credits + ?, mithril = mithril + ? WHERE id = ?', [results[0].gold, results[0].credits, results[0].mithril, req.session.userid], function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error');
														}
														connection.query('INSERT INTO users_redeems SET ?', {
															user: req.session.userid,
															redeem: results[0].id
														}, function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error');
															}
															connection.commit(function(error) {
																if (error) {
																	connection.rollback();
																	return res.end('server error.');
																}
																connection.release();
																res.end('<b class="text-success">Received ' + toCoin(results[0].gold) + ' coins, ' + numeral(results[0].credits).format('0,0') + ' credits, and ' + numeral(results[0].mithril).format('0,0') + ' mithril</b>' + '[BREAK]' + (results[0].gold + userData[0].gold) + '[BREAK]' + (results[0].credits + userData[0].credits) + '[BREAK]' + (results[0].mithril + userData[0].mithril));
															});
														});
													});
												});
											});
										} else {
											res.end('<b class="text-danger">Not enough valid referrals this month</b>' + '[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits + '[BREAK]' + userData[0].mithril);
										}
									});
								} else {
									res.end('?');
								}
							});
						}
					});
				}
			}
		});
	} else {
		res.end('not logged in');
	}
};

exports.marketBuy = function(req, res) {
	if (req.session.loggedIn) {
		if (req.body.x === 1 && Number.isInteger(parseInt(req.body.y))) {
			connection.query('SELECT * FROM market WHERE id = ? AND status = "selling" AND expires >= NOW()', [req.body.y], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				if (results.length === 1 && results[0].type === 'credits') {
					connection.query('SELECT gold, credits FROM users WHERE id = ?', [req.session.userid], function(error, usergold) {
						if (error) {
							return res.end('database error');
						}
						if (usergold[0].gold >= results[0].price) {
							connection.getConnection(function(error, connection) {
								if (error) {
									return res.end('server error.');
								}
								connection.beginTransaction(function(error) {
									if (error) {
										return res.end('server error.');
									}
									connection.query('UPDATE market SET status = "sold" WHERE status = "selling" AND id = ?', [results[0].id], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error');
										}
										connection.query('UPDATE users SET gold = gold - ?, credits = credits + ? WHERE id = ?', [results[0].price, results[0].amount, req.session.userid], function(error) {
											if (error) {
												connection.rollback();
												return res.end('database error');
											}
											connection.commit(function(error) {
												if (error) {
													connection.rollback();
													return res.end('server error.');
												}
												connection.release();
												res.write('Successfully purchased ' + results[0].amount + ' credits for ' + results[0].price + ' gold!');
												res.write('[BREAK]' + (usergold[0].gold - results[0].price) + '[BREAK]' + (usergold[0].credits + results[0].amount));
												res.end();
											});
										});
									});
								});
							});
						} else {
							res.write('Not enough gold for this purchase!');
							res.write('[BREAK]' + usergold[0].gold + '[BREAK]' + usergold[0].credits);
							res.end();
						}
					});
				} else {
					res.write('Someone has purchased this before you did! Sorry!');
					res.end();
				}
			});
		} else if (req.body.x === 2 && Number.isInteger(parseInt(req.body.y))) {
			connection.query('SELECT * FROM market WHERE id = ? AND user = ? AND status = "sold"', [req.body.y, req.session.userid], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				if (results.length === 1 && results[0].type === 'credits') {
					connection.query('SELECT gold, credits FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
						if (error) {
							return res.end('error');
						}
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('server error.');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('server error.');
								}
								connection.query('DELETE FROM market WHERE id = ?', [req.body.y], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error');
									}
									connection.query('UPDATE users SET gold = gold + ? WHERE id = ?', [Math.floor(results[0].price * 0.9), req.session.userid], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error');
										}
										connection.commit(function(error) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											}
											connection.release();
											res.write('Successfully retrieved ' + toCoin(Math.floor(results[0].price * 0.9)) + ' coins from sales!');
											res.write('[BREAK]' + (userData[0].gold + Math.floor(results[0].price * 0.9)) + '[BREAK]' + userData[0].credits);
											res.end();
										});
									});
								});
							});
						});
					});
				} else {
					res.end('Invalid');
				}
			});
		} else if (req.body.x === 3 && Number.isInteger(parseInt(req.body.y))) {
			connection.query('SELECT * FROM market WHERE id = ? AND status = "selling" AND user = ? AND expires < NOW()', [req.body.y, req.session.userid], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				if (results.length === 1 && results[0].type === 'credits') {
					connection.query('SELECT gold, credits FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
						if (error) {
							return res.end('error');
						}
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('server error.');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('server error.');
								}
								connection.query('DELETE FROM market WHERE id = ?', [req.body.y], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error');
									}
									connection.query('UPDATE users SET credits = credits + ?, pcredits = pcredits + ? WHERE id = ?', [results[0].amount, results[0].amount, req.session.userid], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error');
										}
										connection.commit(function(error) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											}
											connection.release();
											res.write('Successfully retrieved ' + numeral(results[0].amount).format('0,0') + ' credits!');
											res.write('[BREAK]' + userData[0].gold + '[BREAK]' + (userData[0].credits + results[0].amount));
											res.end();
										});
									});
								});
							});
						});
					});
				} else {
					res.end('Invalid');
				}
			});
		} else if (req.body.x === 4 && Number.isInteger(parseInt(req.body.y)) && req.body.y >= 1 && req.body.y <= 10000 && Number.isInteger(parseInt(req.body.z)) && req.body.z >= 1 && req.body.z <= 100000000) {
			connection.query('SELECT gold, credits, pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				if (results[0].pcredits >= req.body.y && results[0].credits >= req.body.y) {
					connection.getConnection(function(error, connection) {
						if (error) {
							return res.end('server error.');
						}
						connection.beginTransaction(function(error) {
							if (error) {
								return res.end('server error.');
							}
							connection.query('UPDATE users SET credits = credits - ?, pcredits = pcredits - ? WHERE id = ?', [req.body.y, req.body.y, req.session.userid], function(error) {
								if (error) {
									connection.rollback();
									return res.end('database error 1');
								}
								connection.query('INSERT INTO market SET ?', {
									user: req.session.userid,
									type: 'credits',
									amount: req.body.y,
									price: req.body.y * req.body.z,
									status: 'selling',
									expires: new Date(Date.now() + 43200000)
								}, function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error 2');
									}
									connection.commit(function(error) {
										if (error) {
											connection.rollback();
											return res.end('server error.');
										}
										connection.release();
										res.write('Successfully listed ' + numeral(req.body.y).format('0,0') + ' credits for 12 hours!');
										res.write('[BREAK]' + results[0].gold + '[BREAK]' + (results[0].credits - req.body.y));
										res.end();
									});
								});
							});
						});
					});
				} else {
					res.write('Insufficient credits/purchased credits. You also need to have credits to sell, not just having purchased credits');
					res.write('[BREAK]' + results[0].gold + '[BREAK]' + results[0].credits);
					res.end();
				}
			});
		} else {
			res.end('No');
		}
	} else {
		res.end('not logged in');
	}
};

exports.mail = function(req, res) {
	if (req.body.x) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
	}
	if (req.body.v) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.v))){
			// noinspection JSCheckFunctionSignatures
			req.body.v = parseInt(req.body.v);
		} else {
			return res.end();
		}
	}
	if (req.session.loggedIn) {
		connection.query('SELECT level, gold FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
			if (error) {
				return res.end('error');
			}
			if (req.body.x === 1 && userData[0].level >= 500 && req.body.v >= 0 && userData[0].gold >= (req.body.v * 1000000) + 100) {
				connection.query('SELECT id FROM users WHERE username = ?', [req.body.y], function(error, results) {
					if (error) {
						return res.end('database error 1');
					}
					if (results.length === 1) {
						connection.query('SELECT id FROM users_mail WHERE receiver = ?', [results[0].id], function(error) {
							if (error) {
								return res.end('error');
							}
							if (results.length < 25) {
								connection.getConnection(function(error, connection) {
									if (error) {
										return res.end('server error.');
									}
									connection.beginTransaction(function(error) {
										if (error) {
											return res.end('server error.');
										}
										connection.query('INSERT INTO users_mail SET ?', {
											sender: req.session.userid,
											receiver: results[0].id,
											title: req.body.z,
											content: req.body.w,
											gold: Math.floor(req.body.v * 1000000 * 0.9)
										}, function(error) {
											if (error) {
												connection.rollback();
												return res.end('database error 2');
											}
											connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [(req.body.v * 1000000) + 100, req.session.userid], function(error) {
												if (error) {
													connection.rollback();
													return res.end('Insufficient gold error');
												}
												connection.commit(function(error) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													connection.release();
													req.session.gold -= req.body.v + 100;
													res.end('Successfully sent mail to ' + req.body.y + '![BREAK]' + (userData[0].gold - req.body.v + 100));
												});
											});
										});
									});
								});
							} else {
								res.end('User cannot receive any more mail. They must delete some first![BREAK]' + userData[0].gold);
							}
						});
					} else {
						res.end('The person you are mailing does not exist.[BREAK]' + userData[0].gold);
					}
				});
			} else if (req.body.x === 2) {
				connection.query('SELECT * FROM users_mail WHERE id = ? AND receiver = ?', [req.body.y, req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					if (results.length === 1) {
						connection.query('DELETE FROM users_mail WHERE id = ?', [req.body.y], function(error) {
							if (error) {
								return res.end('database error');
							}
							res.end('Successfully deleted mail[BREAK]' + userData[0].gold);
						});
					} else {
						res.end('Mail does not exist[BREAK]' + userData[0].gold);
					}
				});
			} else if (req.body.x === 3) {
				connection.query('SELECT gold FROM users_mail WHERE id = ? AND receiver = ? AND retrieved = 0', [req.body.y, req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					if (results.length === 1) {
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('server error.');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('server error.');
								}
								connection.query('UPDATE users SET gold = gold + ? WHERE id = ?', [results[0].gold, req.session.userid], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error');
									}
									connection.query('UPDATE users_mail SET retrieved = 1 WHERE id = ?', [req.body.y], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error');
										}
										connection.commit(function(error) {
											if (error) {
												connection.rollback();
												return res.end('server error.');
											}
											connection.release();
											res.end('Successfully claimed ' + toCoin(results[0].gold) + ' coins![BREAK]' + (userData[0].gold + results[0].gold));
										});
									});
								});
							});
						});
					} else {
						res.end('mail does not exist[BREAK]' + userData[0].gold);
					}
				});
			} else {
				res.end('Some error occured. Maybe you don\'t have enough gold.[BREAK]' + userData[0].gold);
			}
		});
	} else {
		res.end('not logged in');
	}
};

exports.verify = function(req, res) {
	if (req.session.loggedIn) {
		const answer = "no";
		if (req.session.lastBotcheck && Date.now() - req.session.lastBotcheck <= 90000) {
			if (req.body.response === answer) {
				connection.query('UPDATE users SET warns = warns - 1 WHERE id = ?', [req.session.userid], function(error) {
					if (error) {
						return res.end('Cannot query to database. Contact the administrator immediately. Error code 0x0001');
					}
					req.session.lastBotcheck = null;
					res.end();
				});
			} else {
				req.session.lastBotcheck = null;
				res.end();
			}
		} else {
			req.session.lastBotcheck = null;
			res.end();
		}
	} else {
		res.end('not logged in');
	}
};

exports.replenish = function(req, res) {
	if (req.session.loggedIn) {
		let botCheckRNG = Math.floor(Math.random() * 50 + 1);
		if (botCheckRNG === 50) {
			connection.query('UPDATE users SET warns = warns + 1 WHERE id = ?', [req.session.userid], function(error) {
				if (error) {
					return res.end('error');
				}
				req.session.lastBotcheck = Date.now();
				return res.status(400).send('<div style="text-align:center">Are you botting? Answer "no" without the quotes.</div><br /><div style="text-align:center"><div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><div class="input-group mb-3"><input type="text" autocomplete="off" id="secQ" class="form-control border-white" placeholder="Enter your answer"><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Verify" onclick="verify();"></div></div></div></div></div>');
			});
		} else {
			connection.query('SELECT autos FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				req.session.autos = results[0].autos;
				res.end();
			});
		}
	} else {
		res.end('not logged in');
	}
};
