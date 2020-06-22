const connection = require('../../core/db/dbConn');
const bcrypt = require('bcrypt');
const request = require('request');

exports.login = function(req, res) {
    let username = escape(req.body.username);
    let password = req.body.password;
    if (!req.session.loggedIn) {
        if (username && password) {
            connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results) {
                if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
                    connection.query('DELETE FROM sessions WHERE LOWER(data) REGEXP \',"username":"' + (username.replace(/[^a-z0-9]/gi, '')).toLowerCase() + '","access"\'', function(error) {
                        /**
                         * @param results.warns - users' warnings
                         */
                        if (error) {
                            return res.status(401).end('database error');
                        }
                        if (results[0].warns >= 3 || results[0].access === 0) {
                            return res.status(401).end('You are banned. Go on Discord to ask for forgiveness.');
                        }
                        req.session.lastBattle = 0;
                        req.session.userid = results[0].id;
                        req.session.username = results[0].username;
                        req.session.access = results[0].access;
                        req.session.autos = results[0].autos;
                        connection.query('UPDATE users SET lastonline = NOW(), ipaddress = ? WHERE id = ?', [(req.headers['x-forwarded-for'] || req.connection.remoteAddress), req.session.userid], function(error) {
                            if (error) {
                                req.session.destroy();
                                return res.status(401).end('ip error');
                            } else {
                                req.session.loggedIn = true;
                                res.send('Success... redirecting...');
                            }
                        });
                    });
                } else {
                    res.status(401).send('<span style="color:red">Incorrect password/username! Try again in 5 seconds.</span>');
                }
            });
        } else {
            res.status(401).send('<span style="color:red">Incorrect password/username! Try again in 5 seconds.</span>');
        }
    } else {
        res.status(401).send('It appears that you are already logged in. Please log out first!');
    }
};

exports.register = function(req, res) {
    if ((!Number.isInteger(parseInt(req.body.ref))) || parseInt(req.body.ref) < 0 || parseInt(req.body.ref) > 20000000) {
        return res.status(400).send('Invalid referral ID');
    }
    let username = req.body.username;
    let password = req.body.password;
    let hashedPass = bcrypt.hashSync(password, 6);
    let email = req.body.email;
    let gender = req.body.gender;
    let allTogether = {
        username: username,
        password: hashedPass,
        email: email,
        gender: gender,
        ipaddress: (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
        referrer: parseInt(req.body.ref)
    };

    const secretKey = "YOUR_SECRET_KEY";

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.captchaResponse + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function(error, response, body) {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.status(400).send('Captcha verification expired or failed!');
        }

        if (username && password && email && (gender === '1' || gender === '2') && password.length >= 6) {
            connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], function(error, results) {
                if (error) {
                    return res.end('Cannot query to database. Contact the administrator immediately. Error code 0x0001');
                } else if (results.length > 0) {
                    return res.status(400).send('Username or Email already exists! Try again in 5 seconds.');
                } else {
                    connection.query('INSERT INTO users SET ?', allTogether, function(error) {
                        if (error) {
                            res.status(400).send('Cannot query to database. Contact the administrator immediately. Error code 0x0002');
                            return console.error(error.message);
                        } else {
                            res.send('Registration successful! Login!');
                        }
                    });
                }
            });
        } else {
            res.status(400).send('Fill out all fields or double check your password! Try again in 5 seconds.');
        }
    });
};

exports.logout = function(req, res) {
    if (req.session.loggedIn) {
        req.session.destroy();
        res.redirect('/');
        res.end();
    } else {
        res.send('not logged in');
    }
};
