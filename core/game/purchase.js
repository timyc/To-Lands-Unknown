// REWRITE DONE

const connection = require('../../core/db/dbConn');
const async = require('async');

module.exports = function(req, res) {
	if (req.session.loggedIn) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.thing))) {
			// noinspection JSCheckFunctionSignatures
			req.body.thing = parseInt(req.body.thing);
		} else {
			return res.end();
		}
		if (req.body.x === 1) {
			if (req.body.thing > 0 && req.body.thing <= 1000) {
				connection.query('SELECT credits, pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					/**
					 * @param results.pcredits - Purchased Credits
					 * @param results.expboost - Experience boost
					 * @param results.goldboost - Gold boost
					 * @param results.uCredits - User credits
					 * @param items.cost - Cost
					 * @param shopitems.shop
					 * @param shopitems.bcredits
					 * @param shopitems.requirement
					 */
					if (error) {
						return res.end('error');
					}
					if (results[0].credits >= req.body.thing * 2 && results[0].pcredits >= req.body.thing * 2) {
						let timeToAdd = () => {
							if ((Math.floor(Date.now() / 1000) + req.body.thing * 60) - parseInt(gsettings[5].value) >= req.body.thing * 60) {
								return Math.floor(Date.now() / 1000) + req.body.thing * 60;
							} else {
								return parseInt(gsettings[5].value) + req.body.thing * 60;
							}
						};
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('error');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('error');
								}
								connection.query('UPDATE users SET credits = credits - ?, pcredits = pcredits - ? WHERE id = ?', [req.body.thing * 2, req.body.thing * 2, req.session.userid], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error 1');
									}
									connection.query('UPDATE settings SET value = ? WHERE name = "double"', [timeToAdd()], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error 2');
										}
										connection.query('SELECT * FROM settings', function(error, results) {
											if (error) {
												connection.rollback();
												return res.end('database error 3');
											}
											global.gsettings = results;
											connection.query('INSERT INTO chat_messages SET ?', {
												channel: 'global',
												user: 1,
												time: new Date(),
												message: (req.session.username + ' has purchased <b class="text-primary">' + req.body.thing + '</b> minutes of <b>global double</b> for everyone!')
											}, function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error 4');
												}
												connection.commit(function(error) {
													if (error) {
														connection.rollback();
														return res.end('database error 5');
													}
													connection.release();
													res.end('Purchase success![BREAK]' + (results[0].credits - req.body.thing * 2));
												});
											});
										});
									});
								});
							});
						});
					} else {
						res.end('Insufficient purchased credits or credits.[BREAK]' + results[0].credits);
					}
				});
			} else {
				res.end('Invalid number of minutes.');
			}
		} else if (req.body.x === 2) {
			connection.query('SELECT credits, equipslots FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				/**
				 * @param results.equipslots - Equipment slots
				 */
				if (error) {
					return res.end('error');
				}
				if (results[0].equipslots < 5 && results[0].credits >= 100) {
					connection.query('UPDATE users SET credits = credits - 100, equipslots = equipslots + 1 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						}
						res.end('Purchase successful![BREAK]' + (results[0].credits - 100));
					});
				} else {
					res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
				}
			});
		} else if (req.body.x === 3) {
			connection.query('SELECT credits, inventory FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				if (results[0].inventory < 100 && results[0].credits >= 50) {
					connection.query('UPDATE users SET credits = credits - 50, inventory = inventory + 5 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						}
						res.end('Purchase successful![BREAK]' + (results[0].credits - 50));
					});
				} else {
					res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
				}
			});
		} else if (req.body.x === 4) {
			if (req.body.thing === 1) {
				connection.query('SELECT credits, expboost FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results[0].expboost < 1000 && results[0].credits >= 50) {
						connection.query('UPDATE users SET credits = credits - 50, expboost = expboost + 10 WHERE id = ?', [req.session.userid], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('Purchase successful![BREAK]' + (results[0].credits - 50));
						});
					} else {
						res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
					}
				});
			} else {
				let boostToGive = 100;
				let boostCost = 500;
				connection.query('SELECT credits, expboost FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (parseInt(results[0].expboost) + 100 > 1000 && parseInt(results[0].expboost) + 100 < 1100) {
						boostToGive = 1000 - parseInt(results[0].expboost);
						boostCost = (boostToGive / 10) * 50;
					}
					if (results[0].expboost < 1000 && results[0].credits >= boostCost) {
						connection.query('UPDATE users SET credits = credits - ?, expboost = expboost + ? WHERE id = ?', [boostCost, boostToGive, req.session.userid], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('Purchase successful![BREAK]' + (results[0].credits - boostCost));
						});
					} else {
						res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
					}
				});
			}
		} else if (req.body.x === 5) {
			if (req.body.thing === 1) {
				connection.query('SELECT credits, goldboost FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results[0].goldboost < 1000 && results[0].credits >= 50) {
						connection.query('UPDATE users SET credits = credits - 50, goldboost = goldboost + 10 WHERE id = ?', [req.session.userid], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('Purchase successful![BREAK]' + (results[0].credits - 50));
						});
					} else {
						res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
					}
				});
			} else {
				let boostToGive = 100;
				let boostCost = 500;
				connection.query('SELECT credits, goldboost FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (parseInt(results[0].goldboost) + 100 > 1000 && parseInt(results[0].goldboost) + 100 < 1100) {
						boostToGive = 1000 - parseInt(results[0].goldboost);
						boostCost = (boostToGive / 10) * 50;
					}
					if (results[0].goldboost < 1000 && results[0].credits >= boostCost) {
						connection.query('UPDATE users SET credits = credits - ?, goldboost = goldboost + ? WHERE id = ?', [boostCost, boostToGive, req.session.userid], function(error) {
							if (error) {
								return res.end('error');
							}
							res.end('Purchase successful![BREAK]' + (results[0].credits - boostCost));
						});
					} else {
						res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
					}
				});
			}
		} else if (req.body.x === 6) {
			if (Number.isInteger(req.body.thing)) {
				connection.query('SELECT users_purchases.*, users.credits AS uCredits FROM users_purchases, users WHERE users_purchases.id = ? AND users_purchases.user = ? AND users.id = ? AND users_purchases.claimed = 0', [req.body.thing, req.session.userid, req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					if (results.length === 1) {
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('error');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('error');
								}
								connection.query('UPDATE users_purchases SET claimed = 1 WHERE id = ?', [req.body.thing], function(error) {
									if (error) {
										connection.rollback();
										return res.end('database error 1');
									}
									connection.query('UPDATE users SET credits = credits + ?, pcredits = pcredits + ?, reputation = reputation + ? WHERE id = ?', [results[0].credits, results[0].credits, results[0].reputation, req.session.userid], function(error) {
										if (error) {
											connection.rollback();
											return res.end('database error 2');
										}
										if (results[0].credits >= 750) {
											connection.query('SELECT * FROM users_achievements WHERE achievement = 2', function(error, checkA) {
												if (error) {
													connection.rollback();
													return res.end('database error 4');
												}
												if (checkA.length === 0) {
													connection.query('INSERT INTO users_achievements SET ?', {
														user: req.session.userid,
														achievement: 2
													}, function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error 5');
														}
														connection.query('UPDATE users SET access = 5 WHERE id = ?', [req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('database error 7');
															}
															connection.commit(function(error) {
																if (error) {
																	connection.rollback();
																	return res.end('database error 8');
																}
																connection.release();
																req.session.access = 5;
																res.end('Retrieve success![BREAK]' + (results[0].uCredits + results[0].credits));
															});
														});
													});
												} else {
													connection.commit(function(error) {
														if (error) {
															connection.rollback();
															return res.end('database error 6');
														}
														connection.release();
														res.end('Retrieve success![BREAK]' + (results[0].uCredits + results[0].credits));
													});
												}
											})
										} else {
											connection.commit(function(error) {
												if (error) {
													connection.rollback();
													return res.end('database error 3');
												}
												connection.release();
												res.end('Retrieve success![BREAK]' + (results[0].uCredits + results[0].credits));
											});
										}
									});
								});
							});
						});
					} else {
						res.end('Package not found.[BREAK]' + results[0].uCredits);
					}
				});
			} else {
				res.end('Invalid package.[BREAK]');
			}
		} else if (req.body.x === 7) {
			connection.query('SELECT credits, autos FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				let autoPrice = () => {
					if (results[0].autos < 1080) {
						return ((results[0].autos / 10 - 8) * 10);
					} else {
						return 1000;
					}
				};
				if (results[0].credits >= autoPrice()) {
					connection.query('UPDATE users SET credits = credits - ?, autos = autos + 10 WHERE id = ?', [autoPrice(), req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						}
						req.session.autos += 10;
						res.end('Purchase successful![BREAK]' + (results[0].credits - autoPrice()));
					});
				} else {
					res.end('Either maxed out or not enough credits.[BREAK]' + results[0].credits);
				}
			});
		} else if (req.body.x === 8) {
			connection.query('SELECT credits, pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				}
				if (results[0].credits >= 100 && results[0].pcredits >= 100) {
					connection.query('UPDATE users SET reputation = reputation + 5, credits = credits - 100, pcredits = pcredits - 100 WHERE id = ?', [req.session.userid], function(error) {
						if (error) {
							return res.end('error');
						}
						res.end('Purchase successful![BREAK]' + (results[0].credits - 100));
					});
				} else {
					res.end('Not enough credits.[BREAK]' + results[0].credits);
				}
			});
		} else if (req.body.x === 20) {
			connection.query('SELECT reputation, gender FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (Number.isInteger(req.body.thing) && req.body.thing <= reputation_ranks.length && results[0].reputation >= reputation_ranks[req.body.thing - 1].reputation) {
					let rankDisplay = '';
					connection.query('UPDATE users SET reprank = ? WHERE id = ?', [req.body.thing, req.session.userid], function(error) {
						if (error) {
							return res.send('error');
						}
						if (results[0].gender === 1) {
							rankDisplay = reputation_ranks[req.body.thing - 1].nameM;
						} else {
							rankDisplay = reputation_ranks[req.body.thing - 1].nameF;
						}
						res.end('status1[BREAK]' + rankDisplay);
					});
				} else {
					res.status(400).end('not enough rep');
				}
			});
		} else if (req.body.x === 21) {
			connection.query('SELECT * FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
				if (error) {
					return res.end('error');
				}
				connection.query('SELECT COUNT(*) AS count FROM users_items WHERE user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					if (results[0].count >= userData[0].inventory) {
						return res.end('Not enough inventory spaces.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
					}
					if (Number.isInteger(req.body.thing)) {
						let z = 0;
						if (shops[shopitems[req.body.thing - 1].shop - 1].merge === 1) {
							let arrayIt = JSON.parse(JSON.stringify((itemreqs)));
							let funcP2 = arrayIt.filter(function(special) {
								return special.item === shopitems[req.body.thing - 1].item;
							});
							if (items[shopitems[req.body.thing - 1].item - 1].bcredits === 1) {
								z = 1;
							} else {
								z = 2;
							}
							connection.query('SELECT gold, credits FROM users WHERE id = ?', [req.session.userid], function(error) {
								if (error) {
									return res.end('error');
								}
								if (z === 1 && userData[0].credits < items[shopitems[req.body.thing - 1].item - 1].cost) {
									return res.status(200).end('Not enough credits.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
								} else if (z === 2 && userData[0].gold < items[shopitems[req.body.thing - 1].item - 1].cost) {
									return res.status(200).end('Not enough gold.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
								}
								if (funcP2.length > 0) {
									connection.getConnection(function(error, connection) {
										if (error) {
											return res.end('error');
										}
										connection.beginTransaction(function(error) {
											if (error) {
												return res.end('error');
											}
											async.forEachOf(funcP2, function(result, d, callback) {
												let amountReq = funcP2[d].quantity;
												let neededReq = funcP2[d].requirement;
												connection.query('SELECT * FROM users_items WHERE item = ? AND user = ? FOR UPDATE', [neededReq, req.session.userid], function(error, results) {
													if (error) {
														connection.rollback();
														return res.end('Not enough merge materials.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
													}
													if (results.length > 0 && results[0].quantity > amountReq) {
														connection.query('UPDATE users_items SET quantity = quantity - ? WHERE item = ? AND user = ?', [amountReq, neededReq, req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('Not enough merge materials.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
															}
															callback();
														});
													} else if (results.length > 0 && results[0].quantity === amountReq) {
														connection.query('DELETE FROM users_items WHERE item = ? AND user = ?', [neededReq, req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('Not enough merge materials.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
															}
															callback();
														});
													} else {
														connection.rollback();
														return res.end('Not enough merge materials.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
													}
												});
											}, function(err) {
												if (err) {
													connection.rollback();
													return res.end('Server error.');
												}
												connection.query('SELECT * FROM users_items WHERE item = ? AND user = ? FOR UPDATE', [shopitems[req.body.thing - 1].item, req.session.userid], function(error, results) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													if (results.length > 0 && items[shopitems[req.body.thing - 1].item - 1].stack >= results[0].quantity) {
														return connection.rollback(function() {
															res.status(401).end('You already have the maximum quantity for this item.');
														});
													} else if (results.length > 0 && items[shopitems[req.body.thing - 1].item - 1].stack >= results[0].quantity) {
														connection.query('UPDATE users_items SET quantity = quantity + 1 WHERE item = ? AND user = ?', [shopitems[req.body.thing - 1].item, req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															if (z === 1) {
																connection.query('UPDATE users SET credits = credits - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																		res.status(200).end('Successfully merged item[BREAK]' + userData[0].gold + '[BREAK]' + (userData[0].credits - items[shopitems[req.body.thing - 1].item - 1].cost));
																	});
																});
															} else {
																connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																		res.status(200).end('Successfully merged item[BREAK]' + (userData[0].gold - items[shopitems[req.body.thing - 1].item - 1].cost) + '[BREAK]' + userData[0].credits);
																	});
																});
															}
														});
													} else {
														connection.query('INSERT INTO users_items SET ?', {
															user: req.session.userid,
															item: shopitems[req.body.thing - 1].item,
															equipped: 0,
															quantity: 1
														}, function(error) {
															if (error) {
																connection.rollback();
																return res.end('Not enough merge materials.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
															}
															if (z === 1) {
																connection.query('UPDATE users SET credits = credits - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																		res.status(200).end('Successfully merged item[BREAK]' + userData[0].gold + '[BREAK]' + (userData[0].credits - items[shopitems[req.body.thing - 1].item - 1].cost));
																	});
																});
															} else {
																connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																		res.status(200).end('Successfully merged item[BREAK]' + (userData[0].gold - items[shopitems[req.body.thing - 1].item - 1].cost) + '[BREAK]' + userData[0].credits);
																	});
																});
															}
														});
													}
												});
											});
										});
									});
								}
							});
						} else {
							if (items[shopitems[req.body.thing - 1].item - 1].bcredits === 1) {
								connection.query('SELECT credits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
									if (error) {
										return res.end('error');
									}
									if (results[0].credits >= items[shopitems[req.body.thing - 1].item - 1].cost) {
										connection.getConnection(function(error, connection) {
											if (error) {
												return res.end('error');
											}
											connection.beginTransaction(function(error) {
												if (error) {
													return res.end('error');
												}
												connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [items[shopitems[req.body.thing - 1].item - 1].id, req.session.userid], function(error, results) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													if (results[0].quantity >= items[shopitems[req.body.thing - 1].item - 1].stack) {
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.release();
															res.status(200).end('You already have the maximum amount of this item[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
														});
													} else if (results[0].quantity < items[shopitems[req.body.thing - 1].item - 1].stack) {
														connection.query('UPDATE users_items SET quantity = quantity + 1 WHERE item = ? AND user = ?', [items[shopitems[req.body.thing - 1].item - 1].id, req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.query('UPDATE users SET credits = credits - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																	res.status(200).end('Successfully purchased the item.[BREAK]' + userData[0].gold + '[BREAK]' + (userData[0].credits - items[shopitems[req.body.thing - 1].item - 1].cost));
																});
															});
														});
													} else {
														connection.query('INSERT INTO users_items SET ?', {
															user: req.session.userid,
															item: shopitems[req.body.thing - 1].item,
															equipped: 0,
															quantity: 1
														}, function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.query('UPDATE users SET credits = credits - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																	res.end('Successfully purchased the item.[BREAK]' + userData[0].gold + '[BREAK]' + (userData[0].credits - items[shopitems[req.body.thing - 1].item - 1].cost));
																});
															});
														});
													}
												});
											});
										});
									} else {
										res.end('You do not have enough credits.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
									}
								});
							} else {
								connection.query('SELECT gold FROM users WHERE id = ?', [req.session.userid], function(error, results) {
									if (error) {
										return res.end('error');
									}
									if (results[0].gold >= items[shopitems[req.body.thing - 1].item - 1].cost) {
										connection.getConnection(function(error, connection) {
											if (error) {
												return res.end('error');
											}
											connection.beginTransaction(function(error) {
												if (error) {
													return res.end('error');
												}
												connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [items[shopitems[req.body.thing - 1].item - 1].id, req.session.userid], function(error, results) {
													if (error) {
														connection.rollback();
														return res.end('server error.');
													}
													if (results.length === 1 && results[0].quantity >= items[shopitems[req.body.thing - 1].item - 1].stack) {
														connection.commit(function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.release();
															res.status(200).end('You already have the maximum amount of this item[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
														});
													} else if (results.length === 1 && results[0].quantity < items[shopitems[req.body.thing - 1].item - 1].stack) {
														connection.query('UPDATE users_items SET quantity = quantity + 1 WHERE item = ? AND user = ?', [items[shopitems[req.body.thing - 1].item - 1].id, req.session.userid], function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																	res.status(200).end('Successfully purchased the item.[BREAK]' + (userData[0].gold - items[shopitems[req.body.thing - 1].item - 1].cost) + '[BREAK]' + userData[0].credits);
																});
															});
														});
													} else {
														connection.query('INSERT INTO users_items SET ?', {
															user: req.session.userid,
															item: shopitems[req.body.thing - 1].item,
															equipped: 0,
															quantity: 1
														}, function(error) {
															if (error) {
																connection.rollback();
																return res.end('server error.');
															}
															connection.query('UPDATE users SET gold = gold - ? WHERE id = ?', [items[shopitems[req.body.thing - 1].item - 1].cost, req.session.userid], function(error) {
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
																	res.status(200).end('Successfully purchased the item.[BREAK]' + (userData[0].gold - items[shopitems[req.body.thing - 1].item - 1].cost) + '[BREAK]' + userData[0].credits);
																});
															});
														});
													}
												});
											});
										});
									} else {
										res.end('You do not have enough gold.[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits);
									}
								});
							}
						}
					}
				});
			});
		} else {
			res.status(400).end('undefined');
		}
	} else {
		res.status(401).end('not logged in');
	}
};