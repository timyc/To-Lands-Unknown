const request = require('request');
const connection = require('../../core/db/dbConn');
const querystring = require('querystring');

module.exports = function(req, res) {
	const PAYPAL_EMAIL = 'tolandsunknown@gmail.com';
	// https://github.com/HenryGau/node-paypal-ipn
	// STEP 1: read POST data
	req.body = req.body || {};
	res.status(200).send('OK');
	res.end();

	// read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
	let postreq = 'cmd=_notify-validate';
	for (let key in req.body) {
		if (req.body.hasOwnProperty(key)) {
			let value = querystring.escape(req.body[key]);
			postreq = postreq + "&" + key + "=" + value;
		}
	}

	// Step 2: POST IPN data back to PayPal to validate
	let options = {
		url: 'https://www.paypal.com/cgi-bin/webscr',
		method: 'POST',
		headers: {
			'Connection': 'close'
		},
		body: postreq,
		strictSSL: true,
		rejectUnauthorized: false,
		requestCert: true,
		agent: false
	};

	request(options, function callback(error, response, body) {
		if (!error && response.statusCode === 200) {

			// inspect IPN validation result and act accordingly
			if (body.substring(0, 8) === 'VERIFIED') {

				// assign posted variables to local variables
				let payment_amount = req.body['mc_gross'];
				let txn_id = req.body['txn_id'];
				let paying_player = req.body['custom'];
				let receiver_email = req.body['receiver_email'];
				if (receiver_email === PAYPAL_EMAIL) {
					if (payment_amount === 4.99) {
						connection.query('INSERT INTO users_purchases SET ?', {user: parseInt(paying_player), credits: 125, reputation: 5, transaction: txn_id}, function(error) {
							if (error) {
								console.log('ERROR FOR TXN: ' + txn_id);
							}
						});
					}
					if (payment_amount === 9.99) {
						connection.query('INSERT INTO users_purchases SET ?', {user: parseInt(paying_player), credits: 300, reputation: 10, transaction: txn_id}, function(error) {
							if (error) {
								console.log('ERROR FOR TXN: ' + txn_id);
							}
						});
					}
					if (payment_amount === 19.99) {
						connection.query('INSERT INTO users_purchases SET ?', {user: parseInt(paying_player), credits: 750, reputation: 20, transaction: txn_id}, function(error) {
							if (error) {
								console.log('ERROR FOR TXN: ' + txn_id);
							}
						});
					}
					if (payment_amount === 49.99) {
						connection.query('INSERT INTO users_purchases SET ?', {user: parseInt(paying_player), credits: 2150, reputation: 50, transaction: txn_id}, function(error) {
							if (error) {
								console.log('ERROR FOR TXN: ' + txn_id);
							}
						});
					}
					if (payment_amount === 99.99) {
						connection.query('INSERT INTO users_purchases SET ?', {user: parseInt(paying_player), credits: 5000, reputation: 100, transaction: txn_id}, function(error) {
							if (error) {
								console.log('ERROR FOR TXN: ' + txn_id);
							}
						});
					}
				}
				

			} else if (body.substring(0, 7) === 'INVALID') {
				// IPN invalid, log for manual investigation
				console.log('Invalid IPN!');
				console.log('\n\n');
			}
		}
	});
};