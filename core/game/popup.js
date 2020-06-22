// REWRITE FUNCTIONAL, BUT NEEDS UI UPDATES (GOLD TO COINS)

const connection = require('../../core/db/dbConn');
const numeral = require('numeral');
const toCoin = require('../../core/utils/coins');

module.exports = function(req, res) {
	if (req.session.loggedIn) {
		if (req.body.y) {
			// noinspection JSCheckFunctionSignatures
			if (Number.isInteger(parseInt(req.body.y))){
				// noinspection JSCheckFunctionSignatures
				req.body.y = parseInt(req.body.y);
			} else {
				return res.end();
			}
		}
		if (req.body.x === 'rankings') {
			if (req.body.y === 1) {
				connection.query('SELECT username, level FROM users ORDER BY level DESC LIMIT 50', function(error, results) {
					if (error) {
						res.send('error loading rankings');
					} else {
						res.write('<div style="text-align:center"><h3>Rankings</h3></div>');
						res.write('<div style="text-align:center"><input type="button" class="btn btn-outline-light border-white" value="Level" onclick="openpage(2, 1)"> <input type="button" class="btn btn-outline-light border-white" value="Kills" onclick="openpage(2, 2)"> <input type="button" class="btn btn-outline-light border-white" value="Reputation" onclick="openpage(2, 3)"></div>');
						res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Level</th></tr></thead><tbody>');
						for (let x = 0; x < results.length; x++) {
							res.write('<tr><th scope="row">' + (x + 1) + '</th>' + '<td><a href="javascript:profile(&quot;' + results[x].username + '&quot;);" class="text-light">' + results[x].username + '</a></td>' + '<td>' + results[x].level + '</td></tr>');
						}
						res.write('</tbody></table></div><div class="col"></div></div>');
						res.end();
					}
				});
			} else if (req.body.y === 2) {
				connection.query('SELECT username, kills FROM users ORDER BY kills DESC LIMIT 50', function(error, results) {
					if (error) {
						res.send('error loading rankings');
					} else {
						res.write('<div style="text-align:center"><h3>Rankings</h3></div>');
						res.write('<div style="text-align:center"><input type="button" class="btn btn-outline-light border-white" value="Level" onclick="openpage(2, 1)"> <input type="button" class="btn btn-outline-light border-white" value="Kills" onclick="openpage(2, 2)"> <input type="button" class="btn btn-outline-light border-white" value="Reputation" onclick="openpage(2, 3)"></div>');
						res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Kills</th></tr></thead><tbody>');
						for (let x = 0; x < results.length; x++) {
							res.write('<tr><th scope="row">' + (x + 1) + '</th>' + '<td><a href="javascript:profile(&quot;' + results[x].username + '&quot;);" class="text-light">' + results[x].username + '</a></td>' + '<td>' + results[x].kills + '</td></tr>');
						}
						res.write('</tbody></table></div><div class="col"></div></div>');
						res.end();
					}
				});
			} else if (req.body.y === 3) {
				connection.query('SELECT username, reputation FROM users ORDER BY reputation DESC LIMIT 50', function(error, results) {
					if (error) {
						res.send('error loading rankings');
					} else {
						res.write('<div style="text-align:center"><h3>Rankings</h3></div>');
						res.write('<div style="text-align:center"><input type="button" class="btn btn-outline-light border-white" value="Level" onclick="openpage(2, 1)"> <input type="button" class="btn btn-outline-light border-white" value="Kills" onclick="openpage(2, 2)"> <input type="button" class="btn btn-outline-light border-white" value="Reputation" onclick="openpage(2, 3)"></div>');
						res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Rep.</th></tr></thead><tbody>');
						for (let x = 0; x < results.length; x++) {
							res.write('<tr><th scope="row">' + (x + 1) + '</th>' + '<td><a href="javascript:profile(&quot;' + results[x].username + '&quot;);" class="text-light">' + results[x].username + '</a></td>' + '<td>' + results[x].reputation + '</td></tr>');
						}
						res.write('</tbody></table></div><div class="col"></div></div>');
						res.end();
					}
				});
			} else {
				res.end('undefined');
			}
		} else if (req.body.x === 'ranks') {
			connection.query('SELECT reprank, reputation, gender FROM users WHERE id = ?', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('error');
				} else {
					res.write('<div class="row"><div class="col"></div><div class="col">Your reputation: ' + results[0].reputation + '<br /><div class="input-group mb-3" style="text-align:center"><select class="form-control text-white" style="background-color: rgba(0, 0, 0, 0.3);" id="ranklist">');
					if (results[0].gender === 1) {
						for (let x = 0;
							(x < reputation_ranks.length && reputation_ranks[x].reputation <= results[0].reputation); x++) {
							if (reputation_ranks[results[0].reprank - 1].nameM === reputation_ranks[x].nameM) {
								res.write('<option value="' + reputation_ranks[x].id + '" selected>' + reputation_ranks[x].nameM + '</option>');
							} else {
								res.write('<option value="' + reputation_ranks[x].id + '">' + reputation_ranks[x].nameM + '</option>');
							}
						}
					} else {
						for (let x = 0;
							(x < reputation_ranks.length && reputation_ranks[x].reputation <= results[0].reputation); x++) {
							if (reputation_ranks[results[0].reprank - 1].nameF === reputation_ranks[x].nameF) {
								res.write('<option value="' + reputation_ranks[x].id + '" selected>' + reputation_ranks[x].nameF + '</option>');
							} else {
								res.write('<option value="' + reputation_ranks[x].id + '">' + reputation_ranks[x].nameF + '</option>');
							}
						}
					}
					res.write('</select><div class="input-group-append"><input type="button" class="btn btn-outline-light border-white" value="Change Rank" onclick="buy(20);"></div></div></div><div class="col"></div></div>');
					res.write('<div class="row"><div class="col" style="display:block;text-align:left;margin-left:20px"><b>All ranks for this faction</b><br />');
					if (results[0].gender === 1) {
						for (let x = 0; x < reputation_ranks.length; x++) {
							res.write(reputation_ranks[x].reputation + ' Reputation' + ' - ' + reputation_ranks[x].nameM + '<br />');
						}
					} else {
						for (let x = 0; x < reputation_ranks.length; x++) {
							res.write(reputation_ranks[x].reputation + ' Reputation' + ' - ' + reputation_ranks[x].nameF + '<br />');
						}
					}
					res.end();
				}
			});
		} else if (req.body.x === 'shop') {
			connection.query('SELECT * FROM shops_items WHERE shop = ?', [req.body.y], function(error, results) {
				if (error) {
					return res.send('error');
				} else {
					let creditsDisplay;
					res.write('<div style="text-align:center"><h3>' + shops[req.body.y - 1].name + '</h3></div>');
					res.write('<table class="table table-borderless text-light" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Name</th><th scope="col">Hea.</th><th scope="col">Att.</th><th scope="col">Def.</th><th scope="col">Acc.</th><th scope="col">Eva.</th><th scope="col">Cost</th><th scope="col">Options</th></tr></thead><tbody>');
					for (let x = 0; x < results.length; x++) {
						let color;
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
						if (items[results[x].item - 1].bcredits === 1) {
							creditsDisplay = numeral(items[results[x].item - 1].cost).format('0,0') + ' credits';
						} else {
							creditsDisplay = toCoin(items[results[x].item - 1].cost);
						}
						if (shops[req.body.y - 1].merge === 0) {
							if (items[results[x].item - 1].type === 'artifact') {
								res.write('<tr><td><span style="color:#' + color + '" title="' + items[results[x].item - 1].description + '">' + items[results[x].item - 1].name + '</span></td>' + '<td>' + items[results[x].item - 1].health + '</td>' + '<td>' + items[results[x].item - 1].attack + '</td>' + '<td>' + items[results[x].item - 1].defense + '</td>' + '<td>' + items[results[x].item - 1].accuracy + '</td>' + '<td>' + items[results[x].item - 1].evasion + '</td>' + '<td>' + creditsDisplay + '</td>' + '<td class="text-center"><input type="button" onclick="buy(21, ' + results[x].id + ')" value="Purchase" class="btn btn-outline-light border-white btn-sm"></td>' + '</tr>');
							} else {
								res.write('<tr><td><span style="color:#' + color + '" title="' + items[results[x].item - 1].description + '">' + items[results[x].item - 1].name + '</span></td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>' + creditsDisplay + '</td>' + '<td class="text-center"><input type="button" onclick="buy(21, ' + results[x].id + ')" value="Purchase" class="btn btn-outline-light border-white btn-sm"></td>' + '</tr>');
							}
						} else {
							let mergeItems = '';
							let arrayIt = JSON.parse(JSON.stringify((itemreqs)));
							let funcP2 = arrayIt.filter(function(special) {
								return special.item === results[x].item;
							});
							for (let y = 0; y < funcP2.length; y++) {
								mergeItems += '<li>' + funcP2[y].quantity + ' ' + items[funcP2[y].requirement - 1].name + '</li>';
							}
							if (items[results[x].item - 1].type === 'artifact') {
								res.write('<tr><td><span style="color:#' + color + '" title="' + items[results[x].item - 1].description + '">' + items[results[x].item - 1].name + '</span></td>' + '<td>' + items[results[x].item - 1].health + '</td>' + '<td>' + items[results[x].item - 1].attack + '</td>' + '<td>' + items[results[x].item - 1].defense + '</td>' + '<td>' + items[results[x].item - 1].accuracy + '</td>' + '<td>' + items[results[x].item - 1].evasion + '</td>' + '<td><ul style="margin-bottom:0 !important"><li>' + creditsDisplay + '</li>' + mergeItems + '</ul></td>' + '<td class="text-center"><input type="button" onclick="buy(21, ' + results[x].id + ')" value="Merge" class="btn btn-outline-light border-white btn-sm"></td>' + '</tr>');
							} else {
								res.write('<tr><td><span style="color:#' + color + '" title="' + items[results[x].item - 1].description + '">' + items[results[x].item - 1].name + '</span></td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td>N/A</td>' + '<td><ul style="margin-bottom:0 !important"><li>' + creditsDisplay + '</li>' + mergeItems + '</ul></td>' + '<td class="text-center"><input type="button" onclick="buy(21, ' + results[x].id + ')" value="Merge" class="btn btn-outline-light border-white btn-sm"></td>' + '</tr>');
							}
						}
					}
					res.write('</tbody></table>');
					res.end();
				}
			});
		} else if (req.body.x === 'faq') {
			connection.query('SELECT * FROM faq', function(error, results) {
				if (error) {
					return res.send('error');
				} else {
					res.write('<div style="display:inline-block;text-align:left">');
					for (let x = 0; x < results.length; x++) {
						/**
						 * @param results.answer
						 */
						res.write('<h4 class="text-warning">' + results[x].question + '</h4>');
						res.write('<p>' + results[x].answer + '</p>');
					}
					res.write('</div>');
					res.end();
				}
			})
		} else if (req.body.x === 'updates') {
			connection.query('SELECT * FROM news ORDER BY id DESC', function(error, results) {
				if (error) {
					return res.send('error');
				} else {
					res.write('<div style="display:inline-block;text-align:left">');
					for (let x = 0; x < results.length; x++) {
						res.write('<h4 class="text-success">' + results[x].title + '</h4>');
						res.write('<p>' + results[x].content + '</p>');
						res.write('<p class="text-secondary">By ' + results[x].author + ' on ' + results[x].date + '</p>');
						if (x < results.length - 1) {
							res.write('<hr>');
						}
					}
					res.write('</div>');
					res.end();
				}
			})
		} else if (req.body.x === 'commands') {
			res.write('<div style="text-align:center"><h3>Commands</h3></div>');
			res.write('<div class="row"><div class="col"></div><div class="col-8"><div style="text-align: center;"><div style="display: inline-block; text-align: left;">');
			res.write('<p>/g message - guild chat<br />/w username message - whisper chat<br />/p message - pub chat<br />/m message - market chat<br />/roll - rolls 1d100 and is used with other channels (IE /p /roll to roll in pub)<br />/me message - message displayed in role-play form<br />@ExactUsername - highlights message for user</p>');
			res.write('</div></div></div><div class="col"></div></div>');
			res.end();
		} else if (req.body.x === 'rules') {
			res.write('<div style="text-align:center"><h3>Chat rules</h3></div>');
			res.write('<div class="row"><div class="col">');
			res.write('<p>Don\'t spam invite links. And don\'t harass other people.</p>');
			res.write('</div></div>');
			res.end();
		} else if (req.body.x === 'purchase') {
			let menu = '<a href="javascript:openpage(6, 1)" class="btn btn-outline-light border-white">Purchase</a> <a href="javascript:openpage(6, 2)" class="btn btn-outline-light border-white">Global Boosts</a> <a href="javascript:openpage(6, 3)" class="btn btn-outline-light border-white">Misc</a> <a href="javascript:openpage(6, 4)" class="btn btn-outline-light border-white">Retrieve Purchase</a>';
			if (req.body.y === 1) {
				res.write('<div style="text-align:center"><h3>Purchase credits</h3></div>');
				res.write('<div style="text-align:center">' + menu + '</div>');
				res.write('<div class="row"><div class="col">');
				res.write('<br /><p>Buying credits keeps the server up</p><p class="text-success">To retrieve your credits after a purchase, click [Retrieve Purchase]!<br /> Every $ spent grants one reputation ($ rounds UP)</p>');
				//res.write('<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="custom" value="' + req.session.userid + '"><input type="hidden" name="hosted_button_id" value="3QXJPHVJW9Y4Y"><table><tr><td><input type="hidden" name="on0" value="Packages">Packages</td></tr><tr><td><select name="os0"><option value="125 Credits" style="background-color:unset!important">125 Credits $4.99 USD</option><option value="300 Credits" style="background-color:unset!important">300 Credits $9.99 USD</option><option value="750 Credits" style="background-color:unset!important">750 Credits $19.99 USD</option><option value="2150 Credits" style="background-color:unset!important">2150 Credits $49.99 USD</option><option value="5000 Credits" style="background-color:unset!important">5000 Credits $99.99 USD</option></select> </td></tr></table><input type="hidden" name="currency_code" value="USD"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');
				res.write('<a href="/shop" target="_blank" class="btn btn-outline-light border-white">Click here to buy credits</a>');
				res.write('<br /><p>The base price for credits per dollar is 20/$1.</p><div class="row"><div class="col text-left" style="margin-left:50px"><u>How much more worth it for bigger packages? Calculations are shown below.</u><p>$4.99 package - 25 bonus credits<br />$9.99 package - 100 bonus credits<br />$19.99 package - 350 bonus credits<br />$49.99 package - 1150 bonus credits<br />$99.99 package - 3000 bonus credits<br /><small>* Disclaimer: the amount of credits you are seeing in the tab is the amount you get. The bonuses are already calculated in. *</small></p></div></div>');
				res.write('<span class="text-warning">If you haven\'t received your purchase after 15 minutes, seek help on Discord.</span></div></div>');
				res.end();
			} else if (req.body.y === 2) {
				connection.query('SELECT pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					res.write('<div style="text-align:center"><h3>Purchase global boost</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					res.write('<div class="row"><div class="col">');
					res.write('<br /><div style="text-align:center">You have <b>' + results[0].pcredits + '</b> purchased credits, obtained through <b>Purchase</b></div><br />');
					res.write('<form>Buy <input type="number" min="1" max="1000" id="minutesToBuy" placeholder="1-1000"> minutes of global double for 2 credits/minute each.</form><br /><input type="button" class="btn btn-outline-light border-white" value="Purchase" onclick="buy(1);">');
					res.write('</div></div>');
					res.end();
				});
			} else if (req.body.y === 3) {
				connection.query('SELECT reputation, expboost, goldboost, inventory, equipslots, autos, credits, pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
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
					res.write('<div style="text-align:center"><h3>Purchase misc bonuses</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div><br />');
					res.write('<div style="text-align:center">You have <b>' + results[0].credits + '</b> credits.</div>');
					res.write('<div class="row"><div class="col text-left" style="margin-left:50px;margin-right:50px"><br />');
					res.write('<span>Artifact Equip Slots: ' + results[0].equipslots + '/5 <input type="button" onclick="buy(2)" value="[Buy 1 for 100 Credits]" class="moveBtn font-weight-bold"></span><br />');
					res.write('<span>Inventory Slots: ' + results[0].inventory + '/100 <input type="button" onclick="buy(3)" value="[Buy 5 for 50 Credits]" class="moveBtn font-weight-bold"></span><br /><br />');
					res.write('<span>EXP Boost: ' + results[0].expboost + '/1000% <input type="button" onclick="buy(4, 1)" value="[+10% For 50 Credits]" class="moveBtn font-weight-bold"> <input type="button" onclick="buy(4, 2)" value="[+100% For 500 Credits]" class="moveBtn font-weight-bold"></span><br />');
					res.write('<span>Coin Boost: ' + results[0].goldboost + '/1000% <input type="button" onclick="buy(5, 1)" value="[+10% For 50 Credits]" class="moveBtn font-weight-bold"> <input type="button" onclick="buy(5, 2)" value="[+100% For 500 Credits]" class="moveBtn font-weight-bold"></span><br /><br />');
					res.write('<span>Auto Attacks: ' + results[0].autos + ' <input type="button" onclick="buy(7)" value="[Buy 10 For ' + autoPrice() + ' Credits]" class="moveBtn font-weight-bold"></span><br /><br /><hr><br />');
					res.write('<div style="text-align:center">You have <b>' + results[0].pcredits + '</b> purchased credits (shows how many normal credits can be used for upgrades below.)</div><br />');
					res.write('<span>Reputation: ' + results[0].reputation + ' <input type="button" onclick="buy(8)" value="[Buy 5 For 100 Credits]" class="moveBtn font-weight-bold"></span><br />');
					res.write('</div></div>');
					res.end();
				});
			} else if (req.body.y === 4) {
				connection.query('SELECT * FROM users_purchases WHERE claimed = 0 AND user = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write('<div style="text-align:center"><h3>Retrieve Purchases</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Credits</th><th scope="col">Option</th></tr></thead><tbody>');
					for (let pur = 0; pur < results.length; pur++) {
						res.write('<tr><td>' + numeral(results[pur].credits).format('0,0') + '</td><td><input type="button" onclick="buy(6, ' + results[pur].id + ')" value="[Get Credits]" class="moveBtn"></td>' + '</tr>');
					}
					res.write('</tbody></table></div><div class="col"></div></div>');
					res.end();
				});
			} else {
				res.end('undefined');
			}
		} else if (req.body.x === 'redeem') {
			res.write('<div style="text-align:center"><h3>Code redemption</h3></div>');
			res.write('<div style="text-align:center"><p>Find codes on our Discord!</p></div>');
			res.write('<div style="text-align:center"><p id="redeemResponse"></p></div>');
			res.write('<div class="row"><div class="col"></div><div class="col-8">');
			res.write('<div class="input-group mb-3"><input type="text" autocomplete="off" id="redeem" class="form-control border-white" placeholder="Enter code"><div class="input-group-append"><input type="button" id="redeembutton" class="btn btn-outline-light border-white" value="Redeem" onclick="redeemCode();"></div></div>');
			res.write('</div><div class="col"></div></div>');
			res.end();
		} else if (req.body.x === 'mail') {
			let menu = '<a href="javascript:openpage(11, 1)" class="btn btn-outline-light border-white">Inbox</a> <a href="javascript:openpage(11, 3)" class="btn btn-outline-light border-white">Send Mail</a>';
			connection.query('SELECT level, gold FROM users WHERE id = ?', [req.session.userid], function(error, userGold) {
				if (error) {
					return res.end('error');
				}
				if (req.body.y === 1) {
					connection.query('SELECT users_mail.id AS id, users_mail.title AS title, users_mail.sender AS sender, FROM_UNIXTIME(UNIX_TIMESTAMP(users_mail.sent), "%Y-%m-%d %h:%i:%s") AS sent, users_mail.read AS `read`, users.id AS userid, users.username AS username FROM users_mail, users WHERE users_mail.receiver = ? AND users.id = users_mail.sender ORDER BY users_mail.id DESC LIMIT 25', [req.session.userid], function(error, results) {
						/**
						 * @param results.sent
						 */
						if (error) {
							return res.end('database error');
						}
						res.write('<div style="text-align:center"><h3>Mail Inbox (' + results.length + '/25)</h3></div>');
						res.write('<div style="text-align:center">' + menu + '</div>');
						res.write('<div class="row"><div class="col" style="margin-left:50px;margin-right:50px"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Title</th><th scope="col">From</th><th scope="col">Option</th></tr></thead><tbody>');
						for (let m = 0; m < results.length; m++) {
							if (results[m].read === 0) {
								res.write('<tr><td><a href="javascript:openpage(11, 2, ' + results[m].id + ')" class="text-light font-weight-bold">' + results[m].title + '</a></td>' + '<td>' + results[m].username + ' (' + results[m].sent + ')</td>' + '<td><input type="button" onclick="mail(2, ' + results[m].id + ')" value="[Delete]" class="moveBtn"></td>' + '</tr>');
							} else {
								res.write('<tr><td><a href="javascript:openpage(11, 2, ' + results[m].id + ')" class="text-light">' + results[m].title + '</a></td>' + '<td>' + results[m].username + ' (' + results[m].sent + ')</td>' + '<td><input type="button" onclick="mail(2, ' + results[m].id + ')" value="[Delete]" class="moveBtn"></td>' + '</tr>');
							}
						}
						res.write('</tbody></table></div></div>[BREAK]' + userGold[0].gold);
						res.end();
					});
				} else if (req.body.y === 2 && Number.isInteger(parseInt(req.body.z))) {
					connection.query('SELECT users_mail.*, users.id AS userid, users.username AS username FROM users_mail, users WHERE users_mail.id = ? AND users_mail.receiver = ? AND users.id = users_mail.sender', [req.body.z, req.session.userid], function(error, results) {
						if (error) {
							return res.end('database error');
						}
						if (results.length === 1) {
							connection.query('UPDATE users_mail SET `read` = 1 WHERE id = ?', [req.body.z], function(error) {
								/**
								 * @param results.retrieved
								 */
								if (error) {
									return res.end('database error');
								}
								res.write('<div style="text-align:center"><h3>Read Mail</h3></div>');
								res.write('<div style="text-align:center">' + menu + '</div>');
								res.write('<div class="row"><div class="col"></div><div class="col-8">');
								res.write('<div style="text-align:center"><h4>' + results[0].title + '</h4></div>');
								res.write('<div style="text-align:center"><b>From ' + results[0].username + '</b></div>');
								res.write('<p>' + results[0].content + '</p>');
								if (results[0].gold > 0 && results[0].retrieved === 0) {
									res.write('<p>Attached: ' + toCoin(results[0].gold) + ' <a href="javascript:mail(3, ' + results[0].id + ')" class="text-light">[Claim]</a></p>');
								} else if (results[0].gold > 0 && results[0].retrieved === 1) {
									res.write('<p>Attached: ' + toCoin(results[0].gold) + ' <s>Already claimed</s></p>');
								}
								res.write('</div><div class="col"></div></div>[BREAK]' + userGold[0].gold);
								res.end();
							});
						} else {
							res.end('<div style="text-align:center">HEY, THAT MAIL IS NOT FOR YOU!</div>[BREAK]' + userGold[0].gold);
						}
					});
				} else if (req.body.y === 3) {
					res.write('<div style="text-align:center"><h3>Send Mail</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					if (userGold[0].level >= 500) {
						res.write('<div class="row"><div class="col" style="margin-right:50px;margin-left:50px"><div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text">@</span></div><input type="text" class="form-control" placeholder="Username" id="toUser" maxlength="25"></div>');
						res.write('<div class="input-group mb-3"><input type="text" class="form-control" placeholder="Title" id="toTitle" maxlength="25"></div>');
						res.write('<div class="input-group mb-3"><textarea class="form-control" id="toMessage" style="width:100% !important;" placeholder="Your message" maxlength="1000"></textarea></div>');
						res.write('<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text">Platinum (10% taxed)</span></div><input type="number" min="0" class="form-control" value="0" id="toGold"></div>');
						res.write('<input type="button" class="btn btn-outline-light border-white" value="Send message (1 silver)" onclick="mail(1);">');
						res.write('</div></div>[BREAK]' + userGold[0].gold);
						res.end();
					} else {
						res.end('<br /><div style="text-align:center">The New Government does not allow recruits to send messages until they are at least level 500.</div>[BREAK]' + userGold[0].gold);
					}
				} else {
					res.end('?');
				}
			});
		} else if (req.body.x === 'market') {
			let menu = '<a href="javascript:openpage(12, 1, 0)" class="btn btn-outline-light border-white">Credits</a> <a href="javascript:openpage(12, 2, 0)" class="btn btn-outline-light border-white">Sold</a> <a href="javascript:openpage(12, 3, 0)" class="btn btn-outline-light border-white">Retrieve</a> | <a href="javascript:openpage(12, 4)" class="btn btn-outline-light border-white">Sell Credits</a>';
			if (req.body.y === 1 && Number.isInteger(parseInt(req.body.z))) {
				connection.query('SELECT * FROM market WHERE type = "credits" AND status = "selling" AND expires >= NOW() LIMIT ' + (req.body.z * 10) + ', 10', function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write('<div style="text-align:center"><h3>Credits Market</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Credits</th><th scope="col">Total Price</th><th scope="col">Price Per Unit</th><th scope="col">Option</th></tr></thead><tbody>');
					for (let listing = 0; listing < results.length; listing++) {
						res.write('<tr><td>' + numeral(results[listing].amount).format('0,0') + '</td>' + '<td>' + toCoin(results[listing].price) + '</td>' + '<td>' + toCoin(Math.floor(results[listing].price / results[listing].amount)) + '</td>' + '<td><input type="button" onclick="marketbuy(1, ' + results[listing].id + ')" value="Purchase" class="btn btn-outline-light border-white moveBtn"></td>' + '</tr>');
					}
					res.write('</tbody></table></div><div class="col"></div></div><hr>');
					if (results.length === 10 && req.body.z === 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 1, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length === 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 1, ' + (req.body.z - 1) + ')" class="text-light">Prev</a> | <a href="javascript:openpage(12, 1, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length < 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 1, ' + (req.body.z - 1) + ')" class="text-light">Prev</a></div>');
					}
					res.end();
				});
			} else if (req.body.y === 2 && Number.isInteger(parseInt(req.body.z))) {
				connection.query('SELECT * FROM market WHERE status = "sold" AND user = ? LIMIT ' + (req.body.z * 10) + ', 10', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write('<div style="text-align:center"><h3>Sold Items</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Type</th><th scope="col">Profit</th><th scope="col">Option</th></tr></thead><tbody>');
					for (let listing = 0; listing < results.length; listing++) {
						res.write('<tr><td>' + results[listing].type + ' (' + numeral(results[listing].amount).format('0,0') + ')</td>' + '<td>' + toCoin(Math.floor(results[listing].price * 0.9)) + '</td>' + '<td><input type="button" onclick="marketbuy(2, ' + results[listing].id + ')" value="[Get Profits]" class="moveBtn"></td>' + '</tr>');
					}
					res.write('</tbody></table></div><div class="col"></div></div><hr>');
					if (results.length === 10 && req.body.z === 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 2, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length === 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 2, ' + (req.body.z - 1) + ')" class="text-light">Prev</a> | <a href="javascript:openpage(12, 2, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length < 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 2, ' + (req.body.z - 1) + ')" class="text-light">Prev</a></div>');
					}
					res.end();
				});
			} else if (req.body.y === 3 && Number.isInteger(parseInt(req.body.z))) {
				connection.query('SELECT * FROM market WHERE status = "selling" AND user = ? AND expires < NOW() LIMIT ' + (req.body.z * 10) + ', 10', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('database error');
					}
					res.write('<div style="text-align:center"><h3>Retrieve Unsold Items</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div>');
					res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Type</th><th scope="col">Option</th></tr></thead><tbody>');
					for (let listing = 0; listing < results.length; listing++) {
						res.write('<tr><td>' + results[listing].type + ' (' + results[listing].amount + ')</td><td><input type="button" onclick="marketbuy(3, ' + results[listing].id + ')" value="[Retrieve]" class="moveBtn"></td>' + '</tr>');
					}
					res.write('</tbody></table></div><div class="col"></div></div><hr>');
					if (results.length === 10 && req.body.z === 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 3, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length === 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 3, ' + (req.body.z - 1) + ')" class="text-light">Prev</a> | <a href="javascript:openpage(12, 3, ' + (req.body.z + 1) + ')" class="text-light">Next</a></div>');
					} else if (results.length < 10 && req.body.z > 0) {
						res.write('<div style="text-align:center"><a href="javascript:openpage(12, 3, ' + (req.body.z - 1) + ')" class="text-light">Prev</a></div>');
					}
					res.end();
				});
			} else if (req.body.y === 4) {
				connection.query('SELECT pcredits FROM users WHERE id = ?', [req.session.userid], function(error, results) {
					if (error) {
						return res.end('error');
					}
					res.write('<div style="text-align:center"><h3>Sell Credits</h3></div>');
					res.write('<div style="text-align:center">' + menu + '</div><br />');
					res.write('<div style="text-align:center">You have <b>' + results[0].pcredits + '</b> sellable credits, obtained through <b>Purchase</b></div><br />');
					res.write('<div style="text-align:center"><b class="text-warning">Listed credits will be UNRETRIEVABLE for 12 hours!</b></div><br />');
					res.write('<div class="row"><div class="col"></div><div class="col-8">');
					res.write('<form>Sell <input type="number" min="1" max="10000" id="creditsToSell" placeholder="1-10000"> credits for <input type="number" min="1" max="100000000" id="creditsSellPrice" placeholder="1-100000000"> gold each.</form><br /><input type="button" class="btn btn-outline-light border-white" value="List for 12 hours" onclick="marketbuy(4);">');
					res.write('</div><div class="col"></div></div>');
					res.end();
				});
			} else {
				res.end('No.');
			}
		} else if (req.body.x === 'referral') {
			connection.query('SELECT COUNT(DISTINCT ipaddress) AS count FROM users WHERE level >= 100 AND referrer = ? AND (created between DATE_FORMAT(NOW() ,"%Y-%m-01") AND NOW())', [req.session.userid], function(error, results) {
				if (error) {
					return res.end('database error');
				}
				res.write('<div style="text-align:center"><h3>Referral Info</h3></div>');
				res.write('<div style="text-align:center">Your referral link: <b class="text-success">https://tolandsunknown.com/?ref=' + req.session.userid + '</b></div>');
				res.write('<div style="text-align:center">Your referrals this month: <b>' + results[0].count + '</b></div><br />');
				res.write('<div class="row"><div class="col text-left" style="margin-left:100px;margin-right:100px"><p>So, what do referrals do? Unlike other games where you only get rewards after your referrals purchase something, your referral only needs to be level 100 before getting counted as a valid referral. After getting 20 referrals each month, you obtain a redemption code that allows you to get credits and other good stuff! Check the Discord for the code if you already have 20 valid referrals.</p></div></div>');
				res.end();
			});
		} else if (req.body.x === 'online') {
			connection.query('SELECT access, username, reprank, gender FROM users WHERE lastonline > (NOW() - INTERVAL 1 HOUR) ORDER BY access DESC, username ASC', function(error, results) {
				if (error) {
					return res.end('database error');
				}
				let shownRank;
				let authority;
				res.write('<div style="text-align:center"><h3>Who is online?</h3></div>');
				res.write('<div style="text-align:center">Below is the list of users who logged in or fought a mob in the last hour (doesn\'t count lurkers)</div>');
				res.write('<div class="row"><div class="col"></div><div class="col-8"><table class="table table-borderless text-light text-center" style="background-color: rgba(0, 0, 0, 0);"><thead><tr><th scope="col">Users</th></tr></thead><tbody>');
				for (let x = 0; x < results.length; x++) {
					if (results[x].gender === 1) {
						shownRank = reputation_ranks[results[x].reprank - 1].nameM;
					} else {
						shownRank = reputation_ranks[results[x].reprank - 1].nameF;
					}
					switch (true) {
						case (results[x].access === 1):
							authority = '';
							break;
						case (results[x].access === 5):
							authority = '<span style="color:#FFFF00;">Founder</span> ';
							break;
						case (results[x].access === 40):
							authority = '<span style="color:#6666CC;">Mod</span> ';
							break;
						case (results[x].access === 60):
							authority = '<span style="color:#FF0000;">Admin</span> ';
							break;
						default:
							authority = 'Bugged Account or Cheater ';
					}
					res.write('<tr><td style="padding:0"><a href="javascript:profile(&quot;' + results[x].username + '&quot;);" class="text-light">' + authority + ' ' + results[x].username + ' ' + shownRank + '</a></td></tr>');
				}
				res.write('</tbody></table></div><div class="col"></div></div>');
				res.end();
			});
		} else {
			res.send('?');
		}
	} else {
		res.end('not logged in');
	}
};
