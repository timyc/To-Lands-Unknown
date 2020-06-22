// REWRITE DONE

const connection = require('../../core/db/dbConn');
const numeral = require('numeral');
const toCoin = require('../../core/utils/coins');

exports.quest = function(req, res) {
	if (req.session.loggedIn) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
		let action = req.body.x;
		if (action === 0) {
			connection.query('SELECT * FROM users_quests where user = ?', [req.session.userid], function(error, results) {
				if (error) {
					res.send('error');
				} else if (results.length > 0 && results[0].req > results[0].cur) {
					res.send('Quest already started! Progress: <b>' + results[0].cur + ' / ' + results[0].req + '</b><br /><b class="text-danger">DANGER BUTTON BELOW!!!</b><br /><input type="button" class="btn btn-outline-light border-white" value="Drop Quest" onclick="quest(3)">');
				} else if (results.length > 0 && results[0].req <= results[0].cur) {
					res.send('Quest is complete!<br /><input type="button" class="btn btn-outline-light border-white" value="Complete Quest" onclick="quest(1, 0)">');
				} else {
					connection.query('SELECT location FROM users WHERE id = ?', [req.session.userid], function(error, results) {
						if (error) {
							return res.end('error');
						}
						connection.query('SELECT * FROM monsters WHERE location = ?', [results[0].location], function(error, results) {
							if (error) {
								res.send('error');
							} else {
								res.write('<div class="row"><div class="col"></div><div class="col"><div class="input-group mb-3" style="text-align:center"><select id="quest_mob" class="form-control text-white" style="background-color: rgba(0, 0, 0, 0.3);">');
								for (let x = 0; x < results.length; x++) {
									res.write('<option value="' + results[x].id + '">' + results[x].name + '</option>');
								}
								res.write('</select><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Start Quest!" onclick="quest(2,document.getElementById(\'quest_mob\').value)"></div></div></div><div class="col"></div></div>');
								res.end();
							}
						});
					});
				}
			});
		} else if (action === 1) {
			connection.query('SELECT gold, mithril, quests FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
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
						connection.query('SELECT * FROM users_quests WHERE user = ? FOR UPDATE', [req.session.userid], function(error, results) {
							if (error) {
								connection.rollback();
								return res.end('server error.');
							}
							if (results.length > 0 && results[0].req <= results[0].cur) {
								connection.query('DELETE FROM users_quests WHERE user = ?', [req.session.userid], function(error) {
									if (error) {
										connection.rollback();
										return res.end('server error.');
									}
									connection.query('UPDATE users SET gold = gold + ?, mithril = mithril + ?, quests = quests + 1 WHERE id = ?', [Math.floor(((userData[0].quests + 1) / 10) * ((userData[0].quests - 9) * 500)) + ((userData[0].quests + 1) * 500), ((userData[0].quests + 1) * 2), req.session.userid], function(error) {
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
											res.write('Received <b class="text-success">' + toCoin((Math.floor(((userData[0].quests + 1) / 10) * ((userData[0].quests - 9) * 500)) + ((userData[0].quests + 1) * 500))) + '</b> coins and <b class="text-success">' + (userData[0].quests + 1) * 2 + '</b> mithril!<br />');
											res.write('Quest complete! Close the quest window and reopen to accept another quest![BREAK]' + (userData[0].gold + (Math.floor(((userData[0].quests + 1) / 10) * ((userData[0].quests - 9) * 500)) + ((userData[0].quests + 1) * 500))) + '[BREAK]' + (userData[0].mithril + ((userData[0].quests + 1) * 2)) + '[BREAK]' + (userData[0].quests + 1) + '[BREAK] ');
											res.end();
										});

									});

								});
							} else {
								connection.rollback();
								return res.status(401).end('Invalid');
							}
						});
					});
				});
			});
		} else if (action === 2) {
			connection.query('SELECT * FROM users_quests WHERE user = ?', [req.session.userid], function(error, results) {
				if (error) {
					res.send('error');
				}
				if (results.length > 0) {
					return res.end('already on quest');
				} else if (req.body.y > monsters.length) {
					return res.end('undefined monster');
				} else {
					connection.query('SELECT quests FROM users WHERE id = ?', [req.session.userid], function(error, qResult) {
						if (error) {
							return res.end('error');
						}
						let insertObj = {
							user: req.session.userid,
							mon: req.body.y,
							req: (qResult[0].quests + 1) * 25,
							cur: 0
						};
						connection.query('INSERT INTO users_quests SET ?', [insertObj], function(error) {
							if (error) {
								res.send('error');
							} else {
								res.send('Started quest![BREAK]Kill <b class="text-warning">' + (qResult[0].quests + 1) * 25 + '</b> "' + monsters[req.body.y - 1].name + '"');
							}
						});
					});
				}
			});
		} else if (action === 3) {
			connection.query('DELETE FROM users_quests WHERE user = ?', [req.session.userid], function(error) {
				if (error) {
					res.send('Delete failed (thankfully?)');
				} else {
					res.send('Quest deleted successfully. Reopen the quest window to accept another quest.[BREAK] ');
				}
			});
		} else {
			res.send('Don\'t try to hack the game!');
		}
	} else {
		res.status(401).send('not logged in');
	}
};

exports.story = function(req, res) {
	function getStory() {
		connection.query('SELECT gold, credits, mithril FROM users WHERE id = ?', [req.session.userid], function(error, uData) {
			if (error) {
				return res.end('error');
			}
			connection.query('SELECT story, amount FROM users_story WHERE user = ?', [req.session.userid], function(error, results) {
				if (error) {
					return error;
				} else {
					res.write('<h3 class="text-center">' + story[results[0].story - 1].title + '</h3>');
					res.write('<p style="margin-left:20px">' + story[results[0].story - 1].description + '</p>');
					res.write('<p style="margin-left:20px"><b class="text-warning">Requirements:</b> ' + results[0].amount + '/' + story[results[0].story - 1].amount + '</p>');
					res.write('<p style="margin-left:20px"><b class="text-primary">Rewards</b><br />Coins: ' + toCoin(story[results[0].story - 1].gold) + ', Mithril: ' + numeral(story[results[0].story - 1].mithril).format('0,0') + ', Credits: ' + numeral(story[results[0].story - 1].credits).format('0,0') + '</p>');
					if (results[0].story === story.length) {
						res.write('<p class="text-center">This task cannot be completed at this time. Check back later!</p>');
					} else if (results[0].amount < story[results[0].story - 1].amount) {
						res.write('<p class="text-center"><input type="button" class="btn btn-outline-light" value="Complete Task" onclick="story(2);" disabled></p>');
					} else {
						res.write('<p class="text-center"><input type="button" class="btn btn-outline-light" value="Complete Task" onclick="story(2);"></p>');
					}
					res.write('[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril);
					res.end();
				}
			});
		});
	}

	function insertStory() {
		connection.query('SELECT * FROM users_story WHERE user = ?', [req.session.userid], function(error, results) {
			if (error) {
				return res.end('error');
			}
			if (results.length > 0) {
				return res.end('already in a story');
			} else {
				connection.getConnection(function(error, connection) {
					if (error) {
						return res.end('server error.');
					}
					connection.beginTransaction(function(error) {
						if (error) {
							return res.end('server error.');
						}
						connection.query('INSERT INTO users_story SET ?', {
							user: req.session.userid,
							story: 1,
							amount: 0
						}, function(error) {
							if (error) {
								connection.rollback();
								return res.end('server error.');
							}
							connection.query('UPDATE users SET story = story + 1 WHERE id = ?', [req.session.userid], function(error) {
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
									getStory();
								});
							});
						});
					});
				});
			}
		});
	}

	if (req.session.loggedIn) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.x))){
			// noinspection JSCheckFunctionSignatures
			req.body.x = parseInt(req.body.x);
		} else {
			return res.end();
		}
		if (req.body.x === 0) {
			connection.query('SELECT gold, mithril, credits, story FROM users WHERE id = ?', [req.session.userid], function(error, userData) {
				if (error) {
					return res.end('error');
				}
				if (userData[0].story === 0) {
					res.write('<p class="text-center">The story section is the RPG aspect of TLU. To begin, press the button below!<br />');
					res.write('<input type="button" class="btn btn-outline-light" value="Begin Story" onclick="story(1);"></p>');
					res.write('[BREAK]' + userData[0].gold + '[BREAK]' + userData[0].credits + '[BREAK]' + userData[0].mithril);
					res.end();
				} else {
					getStory();
				}
			});
		} else if (req.body.x === 1) {
			insertStory();
		} else if (req.body.x === 2) {
			connection.query('SELECT * FROM users_story WHERE user = ?', [req.session.userid], function(error, results) {
				if (error) {
					return error;
				} else {
					if (results[0].story < story.length && results[0].amount >= story[results[0].story - 1].amount) {
						connection.getConnection(function(error, connection) {
							if (error) {
								return res.end('server error.');
							}
							connection.beginTransaction(function(error) {
								if (error) {
									return res.end('server error.');
								}
								connection.query('UPDATE users_story SET story = story + 1, amount = 0 WHERE user = ?', [req.session.userid], function(error) {
									if (error) {
										connection.rollback();
										return res.end('server error.');
									}
									connection.query('UPDATE users SET gold = gold + ?, mithril = mithril + ?, credits = credits + ?, story = story + 1 WHERE id = ?', [(story[results[0].story - 1].gold), (story[results[0].story - 1].mithril), (story[results[0].story - 1].credits), req.session.userid], function(error) {
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
											res.write('<div style="text-align:center"><h4 class="text-success">Task completed!</h4></div>');
											getStory();
										});
									});
								});
							});
						});
					} else {
						res.write('<div style="text-align:center"><h4 class="text-warning">Did not meet requirements!</h4></div>');
						getStory();
					}
				}
			});
		} else {
			res.end();
		}
	} else {
		res.status(401).send('Not logged in');
	}
};