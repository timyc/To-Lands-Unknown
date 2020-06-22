const connection = require('../../core/db/dbConn');
const async = require('async');
const numeral = require('numeral');
const toCoin = require('../../core/utils/coins');

exports.battle = function(req, res) {
    req.session.curBattle = Date.now();
    let botCheckRNG = Math.floor(Math.random() * 1000 + 1);
    let battleTimer;
    if (req.body.t > 0) {
        battleTimer = 5500
    } else {
        battleTimer = 3000;
    }
    if (req.session.curBattle - req.session.lastBattle < battleTimer) {
        return res.status(400).end('<div class="row" style="text-align:center"><div class="col">You\'re fighting too fast! Slow down!<br /><input type="button" id="bb" class="btn btn-outline-light" value="Continue" onclick="nav(\'battle\');" disabled></div></div>');
    } else {
        if (botCheckRNG === 1000 && req.session.autos === 0 && (req.session.curBattle - req.session.lastBattle > battleTimer)) {
            connection.query('UPDATE users SET warns = warns + 1 WHERE id = ?', [req.session.userid], function(error) {
                if (error) {
                    return res.end('error');
                }
                req.session.lastBotcheck = Date.now();
                return res.status(400).send('<div style="text-align:center">Are you botting? Answer "no" without the quotes.</div><br /><div style="text-align:center"><div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><div class="input-group mb-3"><input type="text" autocomplete="off" id="secQ" class="form-control border-white" placeholder="Enter your answer"><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Verify" onclick="verify();"></div></div></div></div></div>');
            });
        } else {
            try {
                if (req.session.loggedIn && req.body.mob && Number.isInteger(parseInt(req.body.mob)) && req.body.mob <= monsters.length /* && monsters[req.body.mob - 1].location == req.session.location*/ ) {
                    if (req.body.t > 0) {
                        req.session.autos--;
                    }
                    let atkbonus = 1;
                    let hpbonus = 1;
                    let gBoost = 0;
                    let xpBoost = 0;
                    let serverX = 1;
                    let newRng = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
                    let row1Text;
                    let rowWinText;
                    let rowTieText;
                    let rowDefeatText;
                    let basicDropText;
                    let storyDropText;
                    let rowContText;
                    let autoText;
                    let levelUpdate;
                    let monHP;
                    let userHP;
                    let rounds;
                    let thisMon;
                    let timeNow = new Date();
                    let questText = '';
                    let uData;
                    let stats;

                    function fightMon(_callback) {
                        let monColor = 'FFFFFF';
                        let monPrefix = '';
                        let monX = 1;
                        let monType = Math.floor((Math.random() * 50) + 1);
                        if (monType === 40) {
                            monColor = 'f15e75';
                            monPrefix = 'Fool ';
                            monX = 2;
                        } else if (monType === 41) {
                            monColor = 'FFFF00';
                            monPrefix = 'Elite ';
                            monX = 3;
                        } else if (monType === 42) {
                            monColor = '2791D3';
                            monPrefix = 'Veteran ';
                            monX = 4;
                        } else if (monType === 43) {
                            monColor = 'FF0000';
                            monPrefix = 'Ancient ';
                            monX = 5;
                        }
                        let xText = '';
                        if (gsettings[6].value > Math.floor(Date.now() / 1000)) {
                            let iHateMath1 = Math.floor((gsettings[6].value - Math.floor(Date.now() / 1000)) / 60);
                            let iHateMath2 = (gsettings[6].value - Math.floor(Date.now() / 1000)) % 60;
                            if ((iHateMath2.toString()).length === 1) {
                                iHateMath2 = '0' + iHateMath2;
                            }
                            serverX = 3;
                            xText = '*** <span style="color:orange"><b>TRIPLE</b></span> *** (' + iHateMath1 + ':' + iHateMath2 + ' left)';
                        } else if (gsettings[5].value > Math.floor(Date.now() / 1000)) {
                            let iHateMath1 = Math.floor((gsettings[5].value - Math.floor(Date.now() / 1000)) / 60);
                            let iHateMath2 = (gsettings[5].value - Math.floor(Date.now() / 1000)) % 60;
                            if ((iHateMath2.toString()).length === 1) {
                                iHateMath2 = '0' + iHateMath2;
                            }
                            serverX = 2;
                            xText = '*** <span style="color:yellow"><b>DOUBLE</b></span> *** (' + iHateMath1 + ':' + iHateMath2 + ' left)';
                        }
                        let powFxn = (z) => {
                            return (z * (z - 1)) / 2 + 1;
                        };
                        rounds = 0;
                        let userHits = 0;
                        let damageToYou = 0;
                        let damageToThey = 0;
                        let Ymisses = 0;
                        let Ycrits = 0;
                        let Mmisses = 0;
                        let Mcrits = 0;
                        let Ydodges = 0;
                        let Mdodges = 0;
                        let getMonster = req.body.mob;
                        thisMon = monsters[getMonster - 1];
                        let monName = '<span style="color:#' + monColor + '">' + monPrefix + thisMon.name + '</span>';
                        monHP = thisMon.hp * monX;
                        const monHPStatic = monHP;
                        let monATK = thisMon.atk * monX;
                        let monDEF = thisMon.def * monX;
                        let monACC = (thisMon.acc + 5000) / 10000;
                        let monEVA = thisMon.eva / 10000;
                        /**
                         * @param thismon.crit
                         */
                        let monCRP = thisMon.crit / 1000;
                        let monGold = Math.floor(thisMon.gold * serverX * monX * (1 + (gBoost / 100)));
                        let monEXP = Math.floor(thisMon.exp * serverX * monX * (1 + (xpBoost / 100)));
                        userHP = Math.floor(((uData[0].level * uData[0].health) + (10 * uData[0].level)) * hpbonus);
                        const userHPStatic = userHP;
                        let userATK = Math.floor(uData[0].attack * (powFxn(uData[0].shortsword) + powFxn(uData[0].dagger)) * atkbonus);
                        let userDEF = (uData[0].defense + powFxn(uData[0].helmet) + powFxn(uData[0].shoulders) + powFxn(uData[0].wrists) + powFxn(uData[0].gloves) + powFxn(uData[0].chestpiece) + powFxn(uData[0].leggings) + powFxn(uData[0].boots));
                        let userACC = (uData[0].accuracy + 5000) / 10000;
                        let userEVA = uData[0].evasion / 10000;
                        let userCRP = uData[0].critp / 1000;
                        let userCRD = (uData[0].critd / 1000) + 1.5;
                        let userXHP = uData[0].xhitp / 1000;
                        let userXHD = (uData[0].xhitd / 1000) + 0.5;
                        while (monHP > 0 && userHP > 0 && rounds < 50) {
                            let rngDY = (Math.random()).toFixed(4);
                            let rngCR = (Math.random()).toFixed(4);
                            let rngXR = (Math.random()).toFixed(4);
                            if (userACC >= rngDY) {
                                if (rngDY >= monEVA) {
                                    if (userCRP >= rngCR) {
                                        monHP -= Math.floor(Math.floor(userATK * userCRD) / (monDEF + 1));
                                        damageToThey += Math.floor(Math.floor(userATK * userCRD) / (monDEF + 1));
                                        userHits++;
                                        Ycrits++;
                                        if (userXHP >= rngXR) {
                                            monHP -= Math.floor(Math.floor(userATK * userXHD) / (monDEF + 1));
                                            damageToThey += Math.floor(Math.floor(userATK * userXHD) / (monDEF + 1));
                                            userHits++;
                                        }
                                    } else {
                                        monHP -= Math.floor(userATK / (1 + (monDEF * 0.01)));
                                        damageToThey += Math.floor(userATK / (1 + (monDEF * 0.01)));
                                        userHits++;
                                        if (userXHP >= rngXR) {
                                            monHP -= Math.floor((userATK * userXHD) / (1 + (monDEF * 0.01)));
                                            damageToThey += Math.floor((userATK * userXHD) / (1 + (monDEF * 0.01)));
                                            userHits++;
                                        }
                                    }
                                    if (monHP <= 0) {
                                        monHP = 0;
                                        rounds++;
                                        break;
                                    }
                                } else if (rngDY <= monEVA) {
                                    Mdodges++;
                                }
                            } else if (userACC < rngDY) {
                                Ymisses++;
                            }
                            let rngDM = (Math.random()).toFixed(4);
                            let rngMCR = (Math.random()).toFixed(4);
                            if (monACC >= rngDM) {
                                if (rngDM >= userEVA) {
                                    if (monCRP >= rngMCR) {
                                        userHP -= Math.floor(Math.floor(monATK * 2) / (1 + (userDEF * 0.01)));
                                        damageToYou += Math.floor(Math.floor(monATK * 2) / (1 + (userDEF * 0.01)));
                                        Mcrits++;
                                    } else {
                                        userHP -= Math.floor(monATK / (1 + (userDEF * 0.01)));
                                        damageToYou += Math.floor(monATK / (1 + (userDEF * 0.01)));
                                    }
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
                        row1Text = '<div class="row" style="text-align:center"><div class="col">' + uData[0].username + '<br />' + userHPFancy + '<div style="display:inline-block;text-align:left"><i class="fas fa-fist-raised fa-fw"></i> Damage: ' + numeral(Math.floor(damageToThey)).format('0,0') + '<br /><i class="fas fa-bullseye fa-fw"></i> Hits: ' + (userHits) + ' (' + Ycrits + ' crits)<br /><i class="fas fa-fish fa-fw"></i> Dodges: ' + Ydodges + '<br /><i class="fas fa-wind fa-fw"></i> Missed Hits: ' + Ymisses + '</div></div><div class="col">' + monName + '<br />' + monHPFancy + '<div style="display:inline-block;text-align:left"><i class="fas fa-fist-raised fa-fw"></i> Damage: ' + numeral(Math.floor(damageToYou)).format('0,0') + '<br /><i class="fas fa-bullseye fa-fw"></i> Hits: ' + (rounds - Mmisses) + ' (' + Mcrits + ' crits)<br /><i class="fas fa-fish fa-fw"></i> Dodges: ' + Mdodges + '<br /><i class="fas fa-wind fa-fw"></i> Missed Hits: ' + Mmisses + '</div></div></div>';
                        rowWinText = '<div style="text-align:center"><span style="color:green" class="font-weight-bold">You defeated the ' + monName + ' after ' + rounds + ' rounds.</span></div>';
                        rowTieText = '<div style="text-align:center"><span style="color:yellow" class="font-weight-bold">A draw has been declared as no one won within 50 rounds.</span></div>';
                        rowDefeatText = '<div style="text-align:center"><span style="color:red" class="font-weight-bold">You were defeated by the ' + monName + ' after ' + rounds + ' rounds.</span></div>';
                        //drops go between these two
                        basicDropText = '<div style="text-align:center">Coins: ' + toCoin(monGold) + ' - EXP: <span style="color:cyan">' + numeral(monEXP).format('0,0') + '</span> ' + xText + '</div>';
                        storyDropText = '';
                        rowContText = '<div class="row"><div class="col" style="text-align:center"><input type="button" id="bb" class="btn btn-outline-light" value="Continue" onclick="nav(\'battle\');" disabled></div></div>';

                        if (req.body.t > 0) {
                            autoText = '<div class="font-weight-bold text-center" style="padding-top:5px;">Autoing. You have ' + (req.body.t - 1) + ' fights left. <input type="button" class="btn btn-outline-light" id="stopautoB" value="Stop" onclick="stopauto();"> <input type="button" class="btn btn-outline-light border-white" value="Replenish" onclick="replenish();"></div><div id="stopauto" class="text-center"></div>';
                        } else {
                            autoText = '';
                        }
                        if (monHP < 1) {
                            let funcP2;
                            let arrayIt = JSON.parse(JSON.stringify((mondrops)));
                            funcP2 = arrayIt.filter(function(special) {
                                return special.monster === thisMon.id;
                            });
                            let qString = 'exp = exp + ' + monEXP;
                            levelUpdate = 0;
                            let sqlArr = [0, 0, 1, 0, 0, 0, 0, 0, req.session.userid];
                            uData[0].exp += monEXP;
                            uData[0].gold += monGold;
                            uData[0].kills += 1;
                            if (uData[0].exp >= uData[0].level * 25) {
                                qString = 'exp = 0';
                                sqlArr[0] = monGold;
                                sqlArr[1] = 1;
                                levelUpdate = 1;
                                uData[0].level += 1;
                                uData[0].exp = 0;
                            } else {
                                sqlArr[0] = monGold;
                            }
                            let isDrop = x =>
                                thisMon.id / ((x + 1) * 4);

                            if (isDrop(stats[0]) > newRng[0]) {
                                sqlArr[3] = 1;
                                stats[0] += 1;
                                uData[0].health += 1;
                                res.write('<div style="text-align:center;font-weight:bold;">You gained 1 health!</div>');
                            }
                            if (isDrop(stats[1]) > newRng[1]) {
                                sqlArr[4] = 1;
                                stats[1] += 1;
                                uData[0].attack += 1;
                                res.write('<div style="text-align:center;font-weight:bold;">You gained 1 attack!</div>');
                            }
                            if (isDrop(stats[2]) > newRng[2]) {
                                sqlArr[5] = 1;
                                stats[2] += 1;
                                uData[0].defense += 1;
                                res.write('<div style="text-align:center;font-weight:bold;">You gained 1 defense!</div>');
                            }
                            if (isDrop(stats[3]) > newRng[3] && stats[3] < 5000) {
                                sqlArr[6] = 1;
                                stats[3] += 1;
                                uData[0].accuracy += 1;
                                res.write('<div style="text-align:center;font-weight:bold;">You gained 1 accuracy!</div>');
                            }
                            if (isDrop(stats[4]) > newRng[4] && stats[4] < 5000) {
                                sqlArr[7] = 1;
                                stats[4] += 1;
                                uData[0].evasion += 1;
                                res.write('<div style="text-align:center;font-weight:bold;">You gained 1 evasion!</div>');
                            }
                            if (funcP2.length > 0) {
                                async.forEachOf(funcP2, function(result, d, callback) {
                                    let monItem = funcP2[d].item;
                                    let monRate = funcP2[d].rate;
                                    if (monRate * monX > newRng[10]) {
                                        connection.getConnection(function(error, connection) {
                                            if (error) {
                                                return res.end('server error.');
                                            }
                                            connection.beginTransaction(function(error) {
                                                if (error) {
                                                    return res.end('server error.');
                                                }
                                                connection.query('SELECT * FROM users_items WHERE item = ? AND user = ?', [monItem, req.session.userid], function(error, results) {
                                                    if (error) {
                                                        connection.rollback();
                                                        return res.end('server error.');
                                                    }
                                                    if (results.length > 0) {
                                                        if (items[monItem - 1].stack > results[0].quantity && uData[0].inventory > results.length) {
                                                            connection.query('UPDATE users_items SET quantity = quantity + 1 WHERE item = ? AND user = ?', [monItem, req.session.userid], function(error) {
                                                                if (error) {
                                                                    connection.rollback();
                                                                    return res.end('server error.');
                                                                }
                                                                if (monRate < 0.001) {
                                                                    connection.query('INSERT INTO chat_messages SET ?', {
                                                                        channel: 'global',
                                                                        user: '1',
                                                                        time: timeNow,
                                                                        message: (req.session.username + ' has found the ' + items[monItem - 1].name + ' off the corpse of the ' + monName + '.')
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
                                                                            basicDropText += '<div style="text-align:center">Obtained <b>' + items[monItem - 1].name + '</b></div>';
                                                                            connection.release();
                                                                            callback();
                                                                        });
                                                                    });
                                                                } else {
                                                                    connection.commit(function(error) {
                                                                        if (error) {
                                                                            connection.rollback();
                                                                            return res.end('server error.');
                                                                        }
                                                                        basicDropText += '<div style="text-align:center">Obtained <b>' + items[monItem - 1].name + '</b></div>';
                                                                        connection.release();
                                                                        callback();
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
                                                                callback();
                                                            });
                                                        }
                                                    } else {
                                                        connection.query('INSERT INTO users_items SET ?', {
                                                            user: req.session.userid,
                                                            item: monItem,
                                                            quantity: 1
                                                        }, function(error) {
                                                            if (error) {
                                                                connection.rollback();
                                                                return res.end('server error.');
                                                            }
                                                            if (monRate < 0.001) {
                                                                connection.query('INSERT INTO chat_messages SET ?', {
                                                                    channel: 'global',
                                                                    user: '1',
                                                                    time: timeNow,
                                                                    message: (req.session.username + ' has found a ' + items[monItem - 1].name + ' off the corpse of the ' + monName + '.')
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
                                                                        basicDropText += '<div style="text-align:center">Obtained <b>' + items[monItem - 1].name + '</b></div>';
                                                                        connection.release();
                                                                        callback();
                                                                    });
                                                                });
                                                            } else {
                                                                connection.commit(function(error) {
                                                                    if (error) {
                                                                        connection.rollback();
                                                                        return res.end('server error.');
                                                                    }
                                                                    basicDropText += '<div style="text-align:center">Obtained <b>' + items[monItem - 1].name + '</b></div>';
                                                                    connection.release();
                                                                    callback();
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    } else {
                                        callback();
                                    }
                                }, function(err) {
                                    if (err) {
                                        connection.rollback();
                                        return res.end('server error.');
                                    }
                                    connection.query('UPDATE users SET gold = gold + ?, level = level + ?, ' + qString + ', kills = kills + ?, health = health + ?, attack = attack + ?, defense = defense + ?, accuracy = accuracy + ?, evasion = evasion + ? WHERE id = ?', sqlArr, function(error) {
                                        if (error) {
                                            res.send('error');
                                        }
                                        _callback();
                                    });
                                });
                            } else {
                                connection.query('UPDATE users SET gold = gold + ?, level = level + ?, ' + qString + ', kills = kills + ?, health = health + ?, attack = attack + ?, defense = defense + ?, accuracy = accuracy + ?, evasion = evasion + ? WHERE id = ?', sqlArr, function(error) {
                                    if (error) {
                                        res.send('error');
                                    }
                                    _callback();
                                });
                            }
                        } else if (userHP < 1) {
                            _callback();
                        } else if (userHP > 0 && monHP > 0 && rounds >= 50) {
                            _callback();
                        }
                    }
                    async.waterfall([
                        function(callback) {
                            connection.query('SELECT * FROM users WHERE id = ?', [req.session.userid], function(error, results) {
                                if (error) {
                                    return res.end(error);
                                }
                                uData = results;
                                stats = [results[0].health, results[0].attack, results[0].defense, results[0].accuracy, results[0].evasion];
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
                        },
                        function(callback) {
                            connection.query('SELECT * FROM users_guilds WHERE user = ?', [req.session.userid], function(error, results) {
                                if (error) {
                                    return res.end('error');
                                }
                                if (results.length !== 0) {
                                    connection.query('SELECT hpboost, atkboost FROM guilds WHERE id = ?', [results[0].guild], function(error, results) {
                                        if (error) {
                                            return res.end('database error');
                                        }
                                        if (results.length === 1) {
                                            atkbonus = 1 + (results[0].atkboost / 100);
                                            hpbonus = 1 + (results[0].hpboost / 100);
                                            fightMon(function() {
                                                callback();
                                            });
                                        } else {
                                            fightMon(function() {
                                                callback();
                                            });
                                        }
                                    });
                                } else {
                                    fightMon(function() {
                                        callback();
                                    });
                                }
                            });
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            if (gsettings[1].value * serverX > newRng[5]) {
                                let determiner = Math.floor(Math.random() * 10) + 1;
                                if (determiner <= 5) {
                                    connection.query('UPDATE users SET mithril = mithril + 100 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].mithril += 100;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a small cache of 100 mithril!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner > 5 && determiner <= 9) {
                                    connection.query('UPDATE users SET mithril = mithril + 500 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].mithril += 500;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a cache of 500 mithril!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner === 10) {
                                    connection.query('UPDATE users SET mithril = mithril + 2000 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].mithril += 2000;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a HUGE cache of 2000 mithril!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                }
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            if (gsettings[2].value * serverX > newRng[6]) {
                                let determiner = Math.floor(Math.random() * 10) + 1;
                                if (determiner <= 5) {
                                    connection.query('UPDATE users SET credits = credits + 1 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].credits += 1;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has stumbled upon a pouch containing 1 credit!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner > 5 && determiner <= 9) {
                                    connection.query('UPDATE users SET credits = credits + 2 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].credits += 2;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a chest containing 2 credits!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner === 10) {
                                    connection.query('UPDATE users SET credits = credits + 5 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].credits += 5;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: ("Lucky day! " + req.session.username + " has found a chest containing 5 credits!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                }
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            if (gsettings[3].value * serverX > newRng[7]) {
                                let determiner = Math.floor(Math.random() * 10) + 1;
                                if (determiner <= 5) {
                                    connection.query('UPDATE users SET gold = gold + 500000 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].gold += 500000;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a small treasure trove of " + toCoin(500000) + "!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner > 5 && determiner <= 9) {
                                    connection.query('UPDATE users SET gold = gold + 1000000 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].gold += 1000000;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a treasure trove of " + toCoin(1000000) + "!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                } else if (determiner === 10) {
                                    connection.query('UPDATE users SET gold = gold + 5000000 WHERE id = ?', [req.session.userid], function() {
                                        uData[0].gold += 5000000;
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: (req.session.username + " has found a HUGE treasure trove of " + toCoin(5000000) + "!")
                                        }, function(error) {
                                            if (error) {
                                                throw error;
                                            }
                                            callback();
                                        });
                                    });
                                }
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            if (gsettings[4].value * serverX > newRng[9]) {
                                let randBeast = Math.floor(Math.random() * beasts.length) + 1;
                                let randX = Math.floor(Math.random() * locations[uData[0].location - 1].distancex);
                                let randY = Math.floor(Math.random() * locations[uData[0].location - 1].distancey);
                                connection.query('INSERT INTO locations_beasts SET ?', {
                                    location: uData[0].location,
                                    locationx: randX,
                                    locationy: randY,
                                    beast: randBeast,
                                    health: beasts[randBeast - 1].hp
                                }, function(error) {
                                    if (error) {
                                        return res.send(error);
                                    } else {
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: 'global',
                                            user: '1',
                                            time: timeNow,
                                            message: ('The ' + beasts[randBeast - 1].name + ' has been spotted at (' + randX + ', ' + randY + ') of ' + locations[uData[0].location - 1].name + '.')
                                        }, function(error) {
                                            if (error) {
                                                return res.send(error);
                                            }
                                            callback();
                                        });
                                    }
                                });
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            if (uData[0].story > 0) {
                                /**
                                 * @param story.monster
                                 */
                                if (thisMon.id === story[uData[0].story - 1].monster && story[uData[0].story - 1].rate > newRng[8]) {
                                    connection.query('UPDATE users_story SET amount = amount + 1 WHERE user = ?', [req.session.userid], function(error) {
                                        if (error) {
                                            return res.end('error');
                                        }
                                        storyDropText = '<div class="text-center"><b>A story requirement dropped</b></div>';
                                        callback();
                                    });
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        },
                        function(callback) {
                            if (userHP < 1 || (userHP > 0 && monHP > 0 && rounds >= 50)) {
                                return callback();
                            }
                            connection.query('SELECT * FROM users_quests WHERE user = ?', [req.session.userid], function(error, qData) {
                                if (qData.length > 0) {
                                    if (thisMon.id === qData[0].mon && qData[0].cur < qData[0].req) {
                                        connection.query('UPDATE users_quests SET cur = cur + 1 WHERE user = ?', [req.session.userid], function(error) {
                                            if (error) {
                                                return res.end('error');
                                            } else {
                                                questText = '<div class="text-center"><b class="text-warning">Quest: ' + (qData[0].cur + 1) + ' / ' + qData[0].req + '</b></div>';
                                                callback();
                                            }
                                        });
                                    } else if (thisMon.id === qData[0].mon && qData[0].cur >= qData[0].req) {
                                        questText = '<div class="text-center"><b class="text-warning">Quest is done! Turn it in!</b></div>';
                                        callback();
                                    } else {
                                        questText = '<div class="text-center"><b class="text-secondary">Not in quest for this mob.</b></div>';
                                        callback();
                                    }
                                } else {
                                    callback();
                                }
                            });
                        }
                    ], function(error) {
                        if (error) {
                            return res.end('error');
                        }
                        if (monHP < 1) {
                            res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem; padding-right:2.5rem">' + rowWinText + basicDropText + storyDropText + questText + '</div></div>');
                            //drops
                            if (levelUpdate === 1) {
                                res.write('<div class="font-weight-bold text-center">You gained a level!</div>');
                            }
                            res.write(rowContText);
                            res.write(autoText + '[BREAK]');
                            res.write(uData[0].level + '[BREAK]' + numeral(uData[0].exp).format('0,0') + ' / ' + numeral(uData[0].level * 25).format('0,0') + '[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + numeral(stats[0]).format('0,0') + ' (' + numeral(uData[0].health).format('0,0') + ')[BREAK]' + numeral(stats[1]).format('0,0') + ' (' + numeral(uData[0].attack).format('0,0') + ')[BREAK]' + numeral(stats[2]).format('0,0') + ' (' + numeral(uData[0].defense).format('0,0') + ')[BREAK]' + ((stats[3] + 5000) / 100) + '% (' + ((uData[0].accuracy + 5000) / 100) + '%)[BREAK]' + (stats[4] / 100) + '% (' + ((uData[0].evasion + 5000) / 100) + '%)[BREAK]');
                            res.end();
                        } else if (userHP < 1) {
                            res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem; padding-right:2.5rem">' + rowDefeatText + questText + '</div></div>' + rowContText + autoText + '[BREAK]');
                            res.write(uData[0].level + '[BREAK]' + numeral(uData[0].exp).format('0,0') + ' / ' + numeral(uData[0].level * 25).format('0,0') + '[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + numeral(stats[0]).format('0,0') + ' (' + numeral(uData[0].health).format('0,0') + ')[BREAK]' + numeral(stats[1]).format('0,0') + ' (' + numeral(uData[0].attack).format('0,0') + ')[BREAK]' + numeral(stats[2]).format('0,0') + ' (' + numeral(uData[0].defense).format('0,0') + ')[BREAK]' + ((stats[3] + 5000) / 100) + '% (' + ((uData[0].accuracy + 5000) / 100) + '%)[BREAK]' + (stats[4] / 100) + '% (' + ((uData[0].evasion + 5000) / 100) + '%)[BREAK]');
                            res.end();
                        } else if (userHP > 0 && monHP > 0 && rounds >= 50) {
                            res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem; padding-right:2.5rem">' + rowTieText + questText + '</div></div>' + rowContText + autoText + '[BREAK]');
                            res.write(uData[0].level + '[BREAK]' + numeral(uData[0].exp).format('0,0') + ' / ' + numeral(uData[0].level * 25).format('0,0') + '[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + numeral(stats[0]).format('0,0') + ' (' + numeral(uData[0].health).format('0,0') + ')[BREAK]' + numeral(stats[1]).format('0,0') + ' (' + numeral(uData[0].attack).format('0,0') + ')[BREAK]' + numeral(stats[2]).format('0,0') + ' (' + numeral(uData[0].defense).format('0,0') + ')[BREAK]' + ((stats[3] + 5000) / 100) + '% (' + ((uData[0].accuracy + 5000) / 100) + '%)[BREAK]' + (stats[4] / 100) + '% (' + ((uData[0].evasion + 5000) / 100) + '%)[BREAK]');
                            res.end();
                        } else {
                            res.end('unknown error');
                        }
                    });
                } else {
                    res.status(401).end('Error.');
                }
            } catch (error) {
                res.end('A random error occured.');
            }
        }
    }
    req.session.lastBattle = req.session.curBattle;
};

exports.autoBattle = function(req, res) {
    if (req.session.loggedIn) {
        if (req.session.autos > 0) {
            let botCheckRNG = Math.floor(Math.random() * 50 + 1);
            connection.query('SELECT autos FROM users WHERE id = ?', [req.session.userid], function(error, results) {
                if (error) {
                    return res.end('error');
                }
                if (results[0].autos === req.session.autos) {
                    if (botCheckRNG === 50) {
                        connection.query('UPDATE users SET warns = warns + 1 WHERE id = ?', [req.session.userid], function(error) {
                            if (error) {
                                return res.end('error');
                            }
                            req.session.lastBotcheck = Date.now();
                            return res.status(400).send('<div style="text-align:center">Are you botting? Answer "no" without the quotes.</div><br /><div style="text-align:center"><div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><div class="input-group mb-3"><input type="text" autocomplete="off" id="secQ" class="form-control border-white" placeholder="Enter your answer"><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Verify" onclick="verify();"></div></div></div></div></div>');
                        });
                    } else {
                        res.send((req.session.autos).toString());
                    }
                } else {
                    res.send((req.session.autos).toString());
                }
            });
        } else {
            return res.status(400).send('<div style="text-align:center">Click the button to replenish autos.</div><br /><div style="text-align:center"><div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><input type="button" class="btn btn-outline-light border-white" value="Replenish" onclick="replenish();"></div></div></div>');
        }
    } else {
        res.status(401).send('not logged in');
    }
};

exports.battleBeast = function(req, res) {
    if (req.session.loggedIn && req.body.beast && Number.isInteger(parseInt(req.body.beast))) {
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
            if (error) {
                return res.end('error');
            }
            let powFxn = (z) => {
                return (z * (z - 1)) / 2 + 1;
            };
            connection.query('SELECT beasts.id AS beastid, locations_beasts.beast AS beastid2, locations_beasts.health AS beasthp, locations_beasts.locationx AS locationx, locations_beasts.locationy AS locationy, locations_beasts.location AS location FROM beasts, locations_beasts WHERE beasts.id = locations_beasts.beast AND locations_beasts.id = ?', [req.body.beast], function(error, results) {
                if (error) {
                    return res.send(error);
                } else if (results.length > 0 && results[0].locationx === uData[0].locationx && results[0].locationy === uData[0].locationy && results[0].location === uData[0].location) {
                    let rounds = 0;
                    let damageToYou = 0;
                    let damageToThey = 0;
                    let Ymisses = 0;
                    let Mmisses = 0;
                    let Ydodges = 0;
                    let Mdodges = 0;
                    /**
                     * @param results.beastid
                     */
                    let thisMon = beasts[results[0].beastid - 1];
                    let monName = thisMon.name;
                    let timeNow = new Date();
                    /**
                     * @param results.beasthp
                     */
                    let monHP = results[0].beasthp;
                    const monHPStatic = monHP;
                    let monATK = thisMon.atk;
                    let monDEF = thisMon.def;
                    let monACC = (thisMon.acc + 5000) / 10000;
                    let monEVA = thisMon.eva / 10000;
                    let monGold = thisMon.gold;
                    let monCredits = thisMon.credits;
                    let monMithril = thisMon.mithril;
                    let monTimber = thisMon.timber;
                    let monStones = thisMon.stones;
                    let monReputation = thisMon.reputation;
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
                    //drops go between these two
                    let basicDropText;
                    if (monGold > 0) {
                        basicDropText = 'Coins: ' + toCoin(monGold);
                    } else if (monCredits > 0) {
                        basicDropText = 'Credits: ' + numeral(monCredits).format('0,0');
                    } else if (monMithril > 0) {
                        basicDropText = 'Mithril: ' + numeral(monMithril).format('0,0');
                    } else if (monTimber > 0) {
                        basicDropText = 'Timber: ' + numeral(monTimber).format('0,0');
                    } else if (monStones > 0) {
                        basicDropText = 'Stones: ' + numeral(monStones).format('0,0');
                    } else if (monReputation > 0) {
                        basicDropText = 'Reputation: ' + monReputation;
                    }
                    let rowContText = '<div class="row"><div class="col" style="text-align:center"><input type="button" id="bb" class="btn btn-outline-light" value="Continue" onclick="nav(\'battle\');" disabled></div></div>';
                    if (monHP < 1) {
                        connection.query('UPDATE users SET gold = gold + ?, credits = credits + ?, mithril = mithril + ?, timber = timber + ?, stones = stones + ?, reputation = reputation + ? WHERE id = ?', [monGold, monCredits, monMithril, monTimber, monStones, monReputation, req.session.userid], function(error) {
                            if (error) {
                                return error;
                            } else {
                                uData[0].gold += monGold;
                                uData[0].credits += monCredits;
                                uData[0].mithril += monMithril;
                                uData[0].timber += monTimber;
                                uData[0].stones += monStones;
                                uData[0].reputation += monReputation;
                                res.write(row1Text + '<div class="row"><div class="col text-center">' + rowWinText + basicDropText + '</div></div>');
                                res.write(rowContText);
                                res.write('[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + uData[0].timber + '[BREAK]' + uData[0].stones);
                                connection.query('DELETE FROM locations_beasts WHERE id = ?', [req.body.beast], function(error) {
                                    if (error) {
                                        return res.end('error');
                                    } else {
                                        connection.query('INSERT INTO chat_messages SET ?', {
                                            channel: "global",
                                            user: "1",
                                            time: timeNow,
                                            message: ("Great performance! " + req.session.username + " has slain the " + monName + " and is awarded with " + basicDropText + "!")
                                        }, function(error) {
                                            if (error) {
                                                return res.end(error);
                                            }
                                            res.end();
                                        });
                                    }
                                });
                            }
                        });
                    } else if (userHP < 1) {
                        connection.query('UPDATE locations_beasts SET health = health - ? WHERE id = ?', [Math.floor(damageToThey), req.body.beast], function(error) {
                            if (error) {
                                return res.end(error);
                            } else {
                                res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem">' + rowDefeatText + '</div></div>' + rowContText);
                                res.write('[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + uData[0].timber + '[BREAK]' + uData[0].stones);
                                res.end();
                            }
                        });
                    } else if (userHP > 0 && monHP > 0 && rounds >= 50) {
                        connection.query('UPDATE locations_beasts SET health = health - ? WHERE id = ?', [Math.floor(damageToThey), req.body.beast], function(error) {
                            if (error) {
                                return res.end(error);
                            } else {
                                res.write(row1Text + '<div class="row"><div class="col" style="padding-left:2.5rem">' + rowTieText + '</div></div>' + rowContText);
                                res.write('[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + uData[0].timber + '[BREAK]' + uData[0].stones);
                                res.end();
                            }
                        });
                    }
                } else {
                    res.write('Beast has already been slain. <div class="row"><div class="col" style="text-align:center"><input type="button" id="bb" class="btn btn-outline-light" value="Continue" onclick="nav(\'battle\');" disabled></div></div>');
                    res.write('[BREAK]' + uData[0].gold + '[BREAK]' + uData[0].credits + '[BREAK]' + uData[0].mithril + '[BREAK]' + uData[0].timber + '[BREAK]' + uData[0].stones);
                    res.end();
                }
            });
        });
    } else {
        res.status(401).send('not logged in');
    }
};
