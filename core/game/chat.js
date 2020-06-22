const connection = require('../../core/db/dbConn');
const async = require('async');

exports.loadChat = function(req, res) {
    if (req.session.loggedIn) {
        let guildName;
        connection.query('SELECT users_guilds.guild AS guild, guilds.id AS guildid, guilds.name AS guildname FROM users_guilds, guilds WHERE users_guilds.user = ? AND guilds.id = users_guilds.guild', [req.session.userid], function(error, result) {
            /**
             * @param result.guildname - Guild Name
             * @param result.nameM - male name
             * @param result.nameF - female name
             * @param motd.motd - message of the day
             */
            if (error) {
                return res.end('error');
            }
            if (result.length > 0) {
                guildName = result[0].guildname;
            }
            connection.query('SELECT reputation_ranks.nameM, reputation_ranks.nameF, chat_messages.id AS id, chat_messages.channel AS channel, TIME_FORMAT(chat_messages.time, "%T") AS time, chat_messages.time AS timestamp, chat_messages.user AS user, chat_messages.message AS message, users.reprank AS reprank, users.access AS access, users.id AS userid, users.username AS username, users.gender AS gender FROM reputation_ranks, chat_messages, users WHERE (chat_messages.channel = "w" AND SUBSTRING_INDEX(chat_messages.message, " ", 1) = "' + req.session.username + '" AND chat_messages.user = users.id AND users.reprank = reputation_ranks.id) OR (chat_messages.channel = "guild" AND SUBSTRING_INDEX(chat_messages.message, " ", 1) = "' + guildName + '" AND chat_messages.user = users.id AND users.reprank = reputation_ranks.id) OR (chat_messages.user = users.id AND chat_messages.channel = "w" AND users.id = "' + req.session.userid + '" AND users.reprank = reputation_ranks.id) OR (chat_messages.user = users.id AND chat_messages.channel != "w" AND chat_messages.channel != "guild" AND users.reprank = reputation_ranks.id) ORDER BY id DESC LIMIT 20', function(error, results) {
                if (error) {
                    throw error;
                } else {
                    if (results.length > 0) {
                        if (req.body.arg === 'start') {
                            res.write('<div class="chatline"><span style="color:#33CCFF"><b>Message of the day:</b> ' + gsettings[0].value + '</span></div>[BREAK]');
                            async.each([1], function(message, callback) {
                                if (guildName) {
                                    connection.query('SELECT motd FROM guilds WHERE name = ?', [guildName], function(error2, motd) {
                                        /**
                                         * @param motd.length
                                         */
                                        if (motd.length === 1) {
                                            res.write('<div class="chatline"><span style="color:#33CC33">[ ' + guildName + ' ] <b>Message of the day:</b> ' + motd[0].motd + '</span></div>[BREAK]');
                                        }
                                        callback();
                                    });
                                } else {
                                    callback();
                                }
                            }, function() {
                                req.session.chatstuff = new Date();
                                for (let x = 0; x < results.length; x++) {
                                    let rankRank;
                                    let chatRank;
                                    switch (true) {
                                        case (results[x].access === 1):
                                            rankRank = '';
                                            break;
                                        case (results[x].access === 5):
                                            rankRank = '<span style="color:#FFFF00;">Founder</span> ';
                                            break;
                                        case (results[x].access === 40):
                                            rankRank = '<span style="color:#6666CC;">Mod</span> ';
                                            break;
                                        case (results[x].access === 60):
                                            rankRank = '<span style="color:#FF0000;">Admin</span> ';
                                            break;
                                        default:
                                            rankRank = 'Bugged Account or Cheater ';
                                    }
                                    if (results[x].gender === 1) {
                                        chatRank = results[x].nameM;
                                    } else {
                                        chatRank = results[x].nameF;
                                    }
                                    if ((results[x].message).includes('@' + req.session.username)) {
                                        results[x].message = '<mark>' + results[x].message + '</mark>';
                                    }
                                    if (results[x].channel === '') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '[ <a href="javascript:profile(&quot;' + results[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + rankRank + results[x].username + '</a></span>: ' + results[x].message + '</div>[BREAK]');
                                    } else if (results[x].channel === 'global') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '<span style="color:#88FF88"><b>Global:</b> ' + results[x].message + '</span></div>[BREAK]');
                                    } else if (results[x].channel === 'staff') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '<span style="color:#FF6666"><b>Staff (' + results[x].username + '):</b> ' + results[x].message + '</span></div>[BREAK]');
                                    } else if (results[x].channel === 'w') {
                                        let gotName = ((results[x].message).split(" "))[0];
                                        let formattedMessage = () => {
                                            let y = (results[x].message).split(' ');
                                            y[0] = '';
                                            y = y.join(' ');
                                            return y.trim();
                                        };
                                        if ((gotName).toLowerCase() === (req.session.username).toLowerCase()) {
                                            res.write('<div class="chatline">You ever get that urge to talk to yourself? </div>[BREAK]')
                                        } else if (req.session.userid !== results[x].user) {
                                            res.write('<div class="chatline"><span style="color:#DD77DD">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + 'Whisper from <a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + results[x].username + '</a>: ' + formattedMessage() + '</span></div>[BREAK]');
                                        } else if (req.session.userid === results[x].user) {
                                            res.write('<div class="chatline"><span style="color:#DD77DD">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + 'Whisper to <a href="javascript:whisper(&quot;' + gotName + '&quot;)" class="text-light">' + gotName + '</a>: ' + formattedMessage() + '</span></div>[BREAK]');
                                        }
                                    } else if (results[x].channel === 'guild') {
                                        let formattedMessage = () => {
                                            let y = (results[x].message).split(' ');
                                            y[0] = '';
                                            y = y.join(' ');
                                            return y.trim();
                                        };
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '[ <a href="javascript:profile(&quot;' + results[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#33CC33">[ ' + guildName + ' ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + results[x].username + '</a></span>: ' + formattedMessage() + '</span></div>[BREAK]');
                                    } else if (results[x].channel === 'pub') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '[ <a href="javascript:profile(&quot;' + results[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#6666CC">[ Pub ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + results[x].username + '</a></span>: ' + results[x].message + '</span></div>[BREAK]');
                                    } else if (results[x].channel === 'market') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '[ <a href="javascript:profile(&quot;' + results[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#FFAAAA">[ Market ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + results[x].username + '</a></span>: ' + results[x].message + '</span></div>[BREAK]');
                                    } else if (results[x].channel === 'me') {
                                        res.write('<div class="chatline">[' + ((results[x].time).toString()).substr(((results[x].time).toString()).length - 8) + '] ' + '<span style="color:#A9A9A9" class="font-italic"><a href="javascript:whisper(&quot;' + results[x].username + '&quot;)" class="text-light">' + results[x].username + '</a> ' + results[x].message + '</span></div>[BREAK]');
                                    } else {
                                        res.write('Removed malformed message');
                                    }
                                    if (x === results.length - 1) { // arrays start with 0
                                        res.end();
                                    }
                                }
                            });
                        } else {
                            let result2 = JSON.parse(JSON.stringify((results)));
                            let filteredResults = result2.filter(function(obj) {
                                return new Date(obj.timestamp) > new Date(req.session.chatstuff);
                            });
                            if (filteredResults.length > 0) {
                                for (let x = 0; x < filteredResults.length; x++) {
                                    let rankRank;
                                    let chatRank;
                                    switch (true) {
                                        case (filteredResults[x].access === 1):
                                            rankRank = '';
                                            break;
                                        case (filteredResults[x].access === 5):
                                            rankRank = '<span style="color:#FFFF00;">Founder</span> ';
                                            break;
                                        case (filteredResults[x].access === 40):
                                            rankRank = '<span style="color:#6666CC;">Mod</span> ';
                                            break;
                                        case (filteredResults[x].access === 60):
                                            rankRank = '<span style="color:#FF0000;">Admin</span> ';
                                            break;
                                        default:
                                            rankRank = 'Bugged Account or Cheater ';
                                    }
                                    if (filteredResults[x].gender === 1) {
                                        chatRank = filteredResults[x].nameM;
                                    } else {
                                        chatRank = filteredResults[x].nameF;
                                    }
                                    if ((filteredResults[x].message).includes('@' + req.session.username)) {
                                        filteredResults[x].message = '<mark>' + filteredResults[x].message + '</mark>';
                                    }
                                    if (filteredResults[x].channel === '') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '[ <a href="javascript:profile(&quot;' + filteredResults[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + rankRank + filteredResults[x].username + '</a></span>: ' + filteredResults[x].message + '</div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'global') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '<span style="color:#88FF88"><b>Global</b>: ' + filteredResults[x].message + '</span></div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'staff') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '<span style="color:#FF6666"><b>Staff (' + filteredResults[x].username + '):</b> ' + filteredResults[x].message + '</span></div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'w') {
                                        let gotName = ((filteredResults[x].message).split(" "))[0];
                                        let formattedMessage = () => {
                                            let y = (filteredResults[x].message).split(' ');
                                            y[0] = '';
                                            y = y.join(' ');
                                            return y.trim();
                                        };
                                        if ((gotName).toLowerCase() === (req.session.username).toLowerCase()) {
                                            res.write('<div class="chatline">You ever get that urge to talk to yourself? </div>[BREAK]')
                                        } else if (req.session.userid !== filteredResults[x].user) {
                                            res.write('<div class="chatline"><span style="color:#DD77DD">[' + filteredResults[x].time + '] ' + 'Whisper from <a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + filteredResults[x].username + '</a>: ' + formattedMessage() + '</span></div>[BREAK]');
                                        } else if (req.session.userid === filteredResults[x].user) {
                                            res.write('<div class="chatline"><span style="color:#DD77DD">[' + filteredResults[x].time + '] ' + 'Whisper to <a href="javascript:whisper(&quot;' + gotName + '&quot;)" class="text-light">' + gotName + '</a>: ' + formattedMessage() + '</span></div>[BREAK]');
                                        }
                                    } else if (filteredResults[x].channel === 'guild') {
                                        let formattedMessage = function() {
                                            let y = (filteredResults[x].message).split(' ');
                                            y[0] = '';
                                            y = y.join(' ');
                                            return y.trim();
                                        };
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '[ <a href="javascript:profile(&quot;' + filteredResults[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#33CC33">[ ' + guildName + ' ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + filteredResults[x].username + '</a></span>: ' + formattedMessage() + '</span></div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'pub') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '[ <a href="javascript:profile(&quot;' + filteredResults[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#6666CC">[ Pub ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + filteredResults[x].username + '</a></span>: ' + filteredResults[x].message + '</span></div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'market') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '[ <a href="javascript:profile(&quot;' + filteredResults[x].username + '&quot;);">' + chatRank + '</a> ] <span style="color:#FFAAAA">[ Market ] <span style="color:#CCC"><a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + filteredResults[x].username + '</a></span>: ' + filteredResults[x].message + '</span></div>[BREAK]');
                                    } else if (filteredResults[x].channel === 'me') {
                                        res.write('<div class="chatline">[' + filteredResults[x].time + '] ' + '<span style="color:#A9A9A9" class="font-italic"><a href="javascript:whisper(&quot;' + filteredResults[x].username + '&quot;)" class="text-light">' + filteredResults[x].username + '</a> ' + filteredResults[x].message + '</span></div>[BREAK]');
                                    } else {
                                        res.write('Removed malformed message');
                                    }
                                    if (x === filteredResults.length - 1) { // arrays start with 0
                                        req.session.chatstuff = new Date();
                                        res.end();
                                    }
                                }
                            } else {
                                req.session.chatstuff = new Date();
                                res.end();
                            }
                        }
                    } else {
                        req.session.chatstuff = new Date();
                        res.end();
                    }
                }
            });
        });
    } else {
        res.send('<div class="chatline">not logged in</div>');
    }
};

exports.sendChatMessage = function(req, res) {
    if (req.session.loggedIn) {
        connection.query('SELECT level FROM users WHERE id = ?', [req.session.userid], function(error, result) {
            if (error) {
                return res.end('error');
            }
            if (result[0].level < 25) {
                return res.end('<div class="chatline text-warning">You need to be level 25 before sending chat messages.</div>');
            }
            connection.query('SELECT users_guilds.guild AS guild, guilds.id AS guildid, guilds.name AS guildname FROM users_guilds, guilds WHERE users_guilds.user = ? AND guilds.id = users_guilds.guild', [req.session.userid], function(error, gResult) {
                if (error) {
                    return res.end('error');
                }
                connection.query('SELECT muted FROM users WHERE id = ?', [req.session.userid], function(error, results) {
                    if (error) {
                        return res.end('error');
                    }
                    if (results[0].muted === 1) {
                        res.send('<div class="chatline text-danger">You are muted. Go on Discord to ask for forgiveness.</div>');
                    } else {
                        let timeNow = new Date();
                        if (req.body.arg === '' || req.body.arg === 'w' || req.body.arg === 'pub' || req.body.arg === 'market' || req.body.arg === 'me' || (req.body.arg === 'staff' && req.session.access >= 40)) {
                            req.body.message = (req.body.message).trim();
                        } else if (req.body.arg === 'guild' && gResult[0].guildname != null) {
                            req.body.message = gResult[0].guildname + req.body.message;
                            req.body.message = (req.body.message).trim();
                        } else {
                            req.body.arg = '';
                        }
                        let userMessage = req.body.message;
                        userMessage = userMessage.replace(/</g, '&lt;');
                        userMessage = userMessage.replace(/>/g, '&gt;');
                        if (userMessage.includes('/roll')) {
                            userMessage = '<i>rolled a <b>' + Math.floor(Math.random() * 100 + 1) + '</b>.</i>';
                        }
                        let formattedMessage = {
                            channel: req.body.arg,
                            user: req.session.userid,
                            time: timeNow,
                            message: userMessage
                        };
                        connection.query('INSERT INTO chat_messages SET ?', formattedMessage, function(error) {
                            if (error) {
                                throw error;
                            } else {
                                res.end();
                            }
                        });
                    }
                });
            });
        });
    } else {
        res.send('<div class="chatline">not logged in</div>');
    }
};