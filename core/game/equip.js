// REWRITE DONE
const async = require('async');
const connection = require('../../core/db/dbConn');
const numeral = require('numeral');
const toCoins = require('../../core/utils/coins');

module.exports = function(req, res) {
	if (req.body.equip) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.equip))){
			// noinspection JSCheckFunctionSignatures
			req.body.equip = parseInt(req.body.equip);
		} else {
			return res.end();
		}
	}
	if (req.body.upgrade) {
		// noinspection JSCheckFunctionSignatures
		if (Number.isInteger(parseInt(req.body.upgrade))){
			// noinspection JSCheckFunctionSignatures
			req.body.upgrade = parseInt(req.body.upgrade);
		} else {
			return res.end();
		}
	}
	let justChecking = req.body.equip;
	let actuallyUpgrading = req.body.upgrade;
	let eqFxn = (y) => {
		return Math.floor(5000 * Math.pow(y, 1.995));
	};
	let eqFxnNumeral = (w) => {
		return toCoins(Math.floor(5000 * Math.pow(w, 1.995)));
	};
	let powFxn = (z) => {
		return numeral((z * (z - 1)) / 2 + 1).format('0,0');
	};
	if (req.session.loggedIn) {
		function displayEqInfo(eq, _callback) {
			connection.query('SELECT gold, shortsword, dagger, helmet, shoulders, wrists, gloves, chestpiece, leggings, boots FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (eq === 1) {
					res.write('Current Power: ' + powFxn(results[0].shortsword) + '<br />Power Next Level: ' + powFxn(results[0].shortsword + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].shortsword) + '<br /><a class="text-light" href="javascript:equipupgrade(1);">Upgrade</a> | <a class="text-light" href="javascript:augment(1);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 2) {
					res.write('Current Power: ' + powFxn(results[0].dagger) + '<br />Power Next Level: ' + powFxn(results[0].dagger + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].dagger) + '<br /><a class="text-light" href="javascript:equipupgrade(2);">Upgrade</a> | <a class="text-light" href="javascript:augment(2);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 3) {
					res.write('Current Power: ' + powFxn(results[0].helmet) + '<br />Power Next Level: ' + powFxn(results[0].helmet + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].helmet) + '<br /><a class="text-light" href="javascript:equipupgrade(3);">Upgrade</a> | <a class="text-light" href="javascript:augment(3);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 4) {
					res.write('Current Power: ' + powFxn(results[0].shoulders) + '<br />Power Next Level: ' + powFxn(results[0].shoulders + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].shoulders) + '<br /><a class="text-light" href="javascript:equipupgrade(4);">Upgrade</a> | <a class="text-light" href="javascript:augment(4);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 5) {
					res.write('Current Power: ' + powFxn(results[0].wrists) + '<br />Power Next Level: ' + powFxn(results[0].wrists + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].wrists) + '<br /><a class="text-light" href="javascript:equipupgrade(5);">Upgrade</a> | <a class="text-light" href="javascript:augment(5);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 6) {
					res.write('Current Power: ' + powFxn(results[0].gloves) + '<br />Power Next Level: ' + powFxn(results[0].gloves + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].gloves) + '<br /><a class="text-light" href="javascript:equipupgrade(6);">Upgrade</a> | <a class="text-light" href="javascript:augment(6);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 7) {
					res.write('Current Power: ' + powFxn(results[0].chestpiece) + '<br />Power Next Level: ' + powFxn(results[0].chestpiece + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].chestpiece) + '<br /><a class="text-light" href="javascript:equipupgrade(7);">Upgrade</a> | <a class="text-light" href="javascript:augment(7);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else if (eq === 8) {
					res.write('Current Power: ' + powFxn(results[0].leggings) + '<br />Power Next Level: ' + powFxn(results[0].leggings + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].leggings) + '<br /><a class="text-light" href="javascript:equipupgrade(8);">Upgrade</a> | <a class="text-light" href="javascript:augment(8);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				} else {
					res.write('Current Power: ' + powFxn(results[0].boots) + '<br />Power Next Level: ' + powFxn(results[0].boots + 1) + '<br />Cost: ' + eqFxnNumeral(results[0].boots) + '<br /><a class="text-light" href="javascript:equipupgrade(9);">Upgrade</a> | <a class="text-light" href="javascript:augment(9);">Augment</a> | <a class="text-light" href="javascript:closeequip();">Close</a>');
				}
				_callback();
			});
		}
		if (!actuallyUpgrading && justChecking) {
			async.waterfall([
				function(callback) {
					displayEqInfo(justChecking, function() {
						callback();
					});
				}
			], function() {
				res.end();
			});
		} else if (!justChecking && actuallyUpgrading) {
			connection.query('SELECT gold, shortsword, dagger, helmet, shoulders, wrists, gloves, chestpiece, leggings, boots FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					res.send('error');
				} else {
					let shortsword = results[0].shortsword;
					let dagger = results[0].dagger;
					let helmet = results[0].helmet;
					let shoulders = results[0].shoulders;
					let wrists = results[0].wrists;
					let gloves = results[0].gloves;
					let chestpiece = results[0].chestpiece;
					let leggings = results[0].leggings;
					let boots = results[0].boots;
					if (actuallyUpgrading === 1) {
						if (results[0].gold >= eqFxn(shortsword)) {
							connection.query('UPDATE users SET gold = gold - ?, shortsword = shortsword + 1 WHERE username = ?', [eqFxn(shortsword), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end(`<br /><div class="text-success">Successfully upgraded rifle!</div>[BREAK] + (results[0].gold - eqFxn(shortsword)) + '[BREAK]' + numeral(results[0].shortsword + 1).format('0,0')`);
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].shortsword).format('0,0'));
						}
					} else if (actuallyUpgrading === 2) {
						if (results[0].gold >= eqFxn(dagger)) {
							connection.query('UPDATE users SET gold = gold - ?, dagger = dagger + 1 WHERE username = ?', [eqFxn(dagger), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded blaster!</div>[BREAK]' + (results[0].gold - eqFxn(dagger)) + '[BREAK]' + numeral(results[0].dagger + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].dagger).format('0,0'));
						}
					} else if (actuallyUpgrading === 3) {
						if (results[0].gold >= eqFxn(helmet)) {
							connection.query('UPDATE users SET gold = gold - ?, helmet = helmet + 1 WHERE username = ?', [eqFxn(helmet), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded helmet!</div>[BREAK]' + (results[0].gold - eqFxn(helmet)) + '[BREAK]' + numeral(results[0].helmet + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].helmet).format('0,0'));
						}
					} else if (actuallyUpgrading === 4) {
						if (results[0].gold >= eqFxn(shoulders)) {
							connection.query('UPDATE users SET gold = gold - ?, shoulders = shoulders + 1 WHERE username = ?', [eqFxn(shoulders), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded shoulders!</div>[BREAK]' + (results[0].gold - eqFxn(shoulders)) + '[BREAK]' + numeral(results[0].shoulders + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].shoulders).format('0,0'));
						}
					} else if (actuallyUpgrading === 5) {
						if (results[0].gold >= eqFxn(wrists)) {
							connection.query('UPDATE users SET gold = gold - ?, wrists = wrists + 1 WHERE username = ?', [eqFxn(wrists), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded wrists!</div>[BREAK]' + (results[0].gold - eqFxn(wrists)) + '[BREAK]' + numeral(results[0].wrists + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].wrists).format('0,0'));
						}
					} else if (actuallyUpgrading === 6) {
						if (results[0].gold >= eqFxn(gloves)) {
							connection.query('UPDATE users SET gold = gold - ?, gloves = gloves + 1 WHERE username = ?', [eqFxn(gloves), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded gloves!</div>[BREAK]' + (results[0].gold - eqFxn(gloves)) + '[BREAK]' + numeral(results[0].gloves + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].gloves).format('0,0'));
						}
					} else if (actuallyUpgrading === 7) {
						if (results[0].gold >= eqFxn(chestpiece)) {
							connection.query('UPDATE users SET gold = gold - ?, chestpiece = chestpiece + 1 WHERE username = ?', [eqFxn(chestpiece), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded chestpiece!</div>[BREAK]' + (results[0].gold - eqFxn(chestpiece)) + '[BREAK]' + numeral(results[0].chestpiece + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].chestpiece).format('0,0'));
						}
					} else if (actuallyUpgrading === 8) {
						if (results[0].gold >= eqFxn(leggings)) {
							connection.query('UPDATE users SET gold = gold - ?, leggings = leggings + 1 WHERE username = ?', [eqFxn(leggings), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded leggings!</div>[BREAK]' + (results[0].gold - eqFxn(leggings)) + '[BREAK]' + numeral(results[0].leggings + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].leggings).format('0,0'));
						}
					} else {
						if (results[0].gold >= eqFxn(boots)) {
							connection.query('UPDATE users SET gold = gold - ?, boots = boots + 1 WHERE username = ?', [eqFxn(boots), req.session.username], function(error) {
								if (error) {
									res.send('Cannot query to database. Contact the administrator immediately. Error code 0x0004');
								} else {
									async.waterfall([
										function(callback) {
											displayEqInfo(actuallyUpgrading, function() {
												callback();
											});
										}
									], function() {
										res.end('<br /><div class="text-success">Successfully upgraded boots!</div>[BREAK]' + (results[0].gold - eqFxn(boots)) + '[BREAK]' + numeral(results[0].boots + 1).format('0,0'));
									});
								}
							});
						} else {
							res.send('Not enough coins![BREAK]' + (results[0].gold) + '[BREAK]' + numeral(results[0].boots).format('0,0'));
						}
					}
				}
			});
		} else {
			res.status(401).end('I don\'t understand your request.');
		}
	} else {
		res.status(401).end('You\'re not logged in!');
	}
};
