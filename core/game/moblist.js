// REWRITE DONE

const connection = require('../../core/db/dbConn');

module.exports = function(req, res) {
	if (req.session.loggedIn) {
		connection.query('SELECT location, locationx, locationy FROM users WHERE id = ?', [req.session.userid], function(error, result) {
			if (error) {
				return res.end('error');
			}
			connection.query('SELECT * FROM monsters WHERE location = ?', [result[0].location], function(error, results) {
				if (error) {
					return res.end('error');
				} else {
					res.write('<div class="row"><div class="col"></div><div class="col-8"><div class="input-group mb-3" style="text-align:center"><select id="mob" class="form-control text-white" style="background-color: rgba(0, 0, 0, 0.3);">');
					for (let x = 0; x < results.length; x++) {
						res.write('<option value="' + results[x].id + '">' + results[x].name + '</option>');
					}
					res.write('</select><div class="input-group-append"><button id="bb" class="btn btn-outline-light border-white" onclick="lastMonS();battle();"><i class="ra ra-mp5"></i> Attack</button><button class="btn btn-outline-light border-white" id="ab" onclick="lastMonS();auto();"><i class="fas fa-robot"></i> Auto</button></div></div></div><div class="col"></div></div><br />');
					connection.query('SELECT * FROM locations_beasts WHERE locationx = ? AND locationy = ? AND location = ?', [result[0].locationx, result[0].locationy, result[0].location], function(error, results) {
						if (error) {
							return res.end('error');
						} else if (results.length > 0) {
							res.write('<div class="row"><div class="col"></div><div class="col-6"><div class="input-group mb-3" style="text-align:center"><select id="beast" class="form-control text-white" style="background-color: rgba(0, 0, 0, 0.3);">');
							for (let x = 0; x < results.length; x++) {
								res.write('<option value="' + results[x].id + '">' + beasts[results[x].beast - 1].name + '</option>');
							}
							res.write('</select><div class="input-group-append"><input type="button" id="bb2" class="btn btn-outline-light border-white" value="Fight beast!" onclick="battleBeast();"></div></div></div><div class="col"></div></div>');
							res.end();
						} else {
							res.end();
						}
					});
				}
			});
		});
	} else {
		res.status(401).send('not logged in');
	}
};