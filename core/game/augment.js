const connection = require('../db/dbConn');

module.exports = function(req, res) {
    if (req.body.x) {
        // noinspection JSCheckFunctionSignatures
        if (Number.isInteger(parseInt(req.body.x))){
            // noinspection JSCheckFunctionSignatures
            req.body.x = parseInt(req.body.x);
        } else {
            return res.end();
        }
    }
    if (req.body.x < 1 || req.body.x > 9) {
        return res.end('Invalid equipment selected');
    }
    const shards = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    connection.query(`SELECT aug${req.body.x} AS equipment FROM users WHERE id = ?`, [req.session.userid], function(error, userData) {
        /**
         * @param userData.equipment
         */
        if (error) {
            return res.end('database error');
        }
        if (userData[0].equipment > 10) {
            return res.end('Maximum augment level reached for this equipment!');
        }
        const shardCost = (userData[0].equipment + 1) * 3;
        connection.query('SELECT * FROM users_items WHERE user = ? AND item = ?', [req.session.userid, shards[userData[0].equipment]], function(error, results) {
           if (error) {
               return res.end('database error');
           }
           if (results.length === 0 || shardCost > results[0].quantity) {
               return res.end('Insufficient augment shards. Needed shards: x' + shardCost + ' ' + items[11+ userData[0].equipment].name);
           }
            connection.getConnection(function(error, connection) {
                if (error) {
                    return res.end('server error.');
                }
                connection.beginTransaction(function (error) {
                    if (error) {
                        return res.end('server error.');
                    }
                    connection.query(`UPDATE users SET aug${req.body.x} = aug${req.body.x} + 1 WHERE id = ?`, [req.session.userid], function(error) {
                        if (error) {
                            connection.rollback();
                            return res.end('server error.');
                        }
                        if (shardCost < results[0].quantity) {
                            connection.query('UPDATE users_items SET quantity = quantity - ? WHERE user = ? AND item = ?', [shardCost, req.session.userid, shards[userData[0].equipment]], function(error) {
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
                                    res.end('Augment successful![BREAK]' + (userData[0].equipment + 1));
                                });
                            });
                        } else {
                            connection.query('DELETE FROM users_items WHERE user = ? AND item = ?', [req.session.userid, shards[userData[0].equipment]], function(error) {
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
                                    res.end('Augment successful![BREAK]' + (userData[0].equipment + 1));
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};
