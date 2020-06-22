// REWRITE DONE

const connection = require('../../core/db/dbConn');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.profile = function(req, res) {
	if (req.session.loggedIn) {
		let getProfile = req.body.x;
		let gName = '-';
		let gRank = 'N/A';
		let gString = 'Not in a guild';
		connection.query('SELECT id, reprank, username, avatar, gender, access, level, reputation, health, attack, defense, accuracy, evasion, kills, FROM_UNIXTIME(UNIX_TIMESTAMP(created), "%Y-%m-%d %h:%i:%s") AS created FROM users WHERE username = ?', [getProfile], function(error, results) {
			if (error) {
				return res.end('error');
			} else if (results.length < 1) {
				res.send('user not found');
			} else {
				connection.query('SELECT guilds.name AS gname, users_guilds.rank AS grank FROM guilds, users_guilds WHERE guilds.id = users_guilds.guild AND users_guilds.user = ?', [results[0].id], function(error, results2) {
					/**
					 * @param results2.gname
					 * @param results2.grank
					 */
					if (error) {
						return res.end('error');
					}
					if (results2.length === 1) {
						gName = results2[0].gname;
						if (results2[0].grank === 3) {
							gRank = 'Leader';
						} else if (results[0].grank === 2) {
							gRank = 'Officer';
						} else {
							gRank = 'Member';
						}
						gString = gRank + ' of ' + gName;
					}
					connection.query('SELECT achievements.name AS aname, achievements.description AS adesc, achievements.src AS asrc FROM achievements, users_achievements WHERE achievements.id = users_achievements.achievement AND users_achievements.user = ?', [results[0].id], function(error, results3) {
						let rankRank;
						let repRank;
						let pGender = results[0].gender === 1 ? '<i class="fa fa-mars text-primary"></i>' : '<i class="fa fa-venus text-danger"></i>';
						switch (true) {
							case (results[0].access === 0):
								rankRank = 'Banned';
								break;
							case (results[0].access === 1):
								rankRank = 'Player';
								break;
							case (results[0].access === 5):
								rankRank = 'Player (Founder)';
								break;
							case (results[0].access === 40):
								rankRank = '<span style="color:#FFFF00;">Moderator</span>';
								break;
							case (results[0].access === 60):
								rankRank = '<span style="color:#FF0000;">Administrator</span>';
								break;
							default:
								rankRank = 'Bugged Account or Cheater ';
						}
						if (results[0].gender === 1) {
							repRank = reputation_ranks[results[0].reprank - 1].nameM;
						} else {
							repRank = reputation_ranks[results[0].reprank - 1].nameF;
						}
						/**
						 * @param results.avatar
						 * @param results.created
						 */
						res.write('<div class="row">');
						res.write('<div class="col"><div class="card text-white" style="margin-right:10px;border:none; background-color: rgba(0, 0, 0, 0);"><div class="card-body"><div class="text-center">' + repRank + '</div><img src="img/avatars/' + results[0].avatar + '.png" alt="profile pic" width="200" height="200" /></div></div></div>');
						res.write('<div class="col-8"><div class="card text-white" style="background-color: rgba(0, 0, 0, 0);border:1px solid white"><div class="card-body"><h3>' + results[0].username + ' ' + pGender + '</h3><h6>' + gString + '</h6><span style="display:block;text-align:left;"><u>Stats</u><br />Access: ' + rankRank + '<br />Level: ' + results[0].level + '<br />Reputation: ' + results[0].reputation + '<br />Total Base Stats: ' + (results[0].health + results[0].attack + results[0].defense + results[0].accuracy + results[0].evasion) + '<br/>Lifetime kills: ' + results[0].kills + '<br />Date of creation: ' + results[0].created + '</div></div></div>');
						res.write('</div><br /><hr><br /><div style="text-align:center">Achievements</div>');
						/**
						 * @param results3.asrc
						 * @param results3.adesc
						 */
						if (results3.length > 0) {
							res.write('<div class="row"><div class="col"><div style="text-align:center">');
							for (let x = 0; x < results3.length; x++) {
								res.write('<img src="' + results3[x].asrc + '" alt="profile image" width="80" title="' + results3[x].adesc + '" />');
							}
							res.write('</div></div></div>');
						} else {
							res.write('<div style="text-align:center">None</div>');
						}
						res.end();
					});
				});
			}
		});
	}
};

exports.uploadAvatar = function(req, res) {
	if (req.session.loggedIn) {
		connection.query('SELECT level FROM users WHERE id = ?', [req.session.userid], function(error, results) {
			if (results[0].level >= 1000) {
				const avatarsDirectory = '/home/tim/Documents/GitHub/Node-PBBG/public/img/avatars';
				let uploadDest = multer.diskStorage({
					destination: function(request, file, callback) {
						callback(null, avatarsDirectory); // Upload directory, change as needed
					},
					filename: function(request, file, callback) {
						callback(null, req.session.userid + '.png');
					}
				});
				let upload = multer({
					storage: uploadDest,
					fileFilter: function(request, file, callback) {
						if (path.extname(file.originalname) !== '.png') {
							return callback(null, false, new Error('Only PNG files are allowed'));
						}
						if (file.mimetype !== 'image/png') {
							return callback(null, false, new Error('Only PNG files are allowed'));
						}
						callback(null, true);
					},
					limits: {
						fileSize: 1024 * 1024
					}
				}).single('avatar');
				const MAGIC_NUMBERS = {
					jpg: 'ffd8ffe0',
					jpg1: 'ffd8ffe1',
					png: '89504e47',
					gif: '47494638'
				};

				function checkMagicNumbers(magic) {
					if (magic === MAGIC_NUMBERS.jpg || magic === MAGIC_NUMBERS.jpg1 || magic === MAGIC_NUMBERS.png || magic === MAGIC_NUMBERS.gif) {
						return true;
					}
				}
				upload(req, res, function(err) {
					if (err) {
						return res.end(err);
					}
					if (!req.file) {
						return res.end('No avatar chosen for upload.');
					}
					let theImage = fs.readFileSync(avatarsDirectory + '/' + req.session.userid + '.png').toString('hex', 0, 4);
					if (!checkMagicNumbers(theImage)) {
						fs.unlinkSync(avatarsDirectory + '/' + req.session.userid + '.png');
						connection.query('UPDATE users SET avatar = 0 WHERE id = ?', [req.session.userid, req.session.userid], function(error) {
							if (error) {
								return res.end('Critical database error.');
							}
							res.end('Malware detected on avatar. Upload failed.');
						});
					} else {
						connection.query('UPDATE users SET avatar = ? WHERE id = ?', [req.session.userid, req.session.userid], function(error) {
							if (error) {
								return res.end('Critical database error.');
							}
							res.end('Avatar successfully changed. Cache clears on a daily basis, so you will not immediately see your avatar change.');
						});
					}
				});
			} else {
				res.end('Level not high enough for custom avatar.');
			}
		});
	} else {
		res.end('not logged in');
	}
};