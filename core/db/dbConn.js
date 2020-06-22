const mysql = require('mysql');
const config = require('../../config/mysqlconf');
let doConn;

function connectDB() {
	if (!doConn) {
		doConn = mysql.createPool(config);
		doConn.getConnection(function(error) {
			if (error) {
				console.log('[ERROR] Database connection failed!');
				return error;
			}
			doConn.query('SELECT * FROM monsters', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded monsters');
				global.monsters = results;
			});
			doConn.query('SELECT * FROM items', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded items');
				global.items = results;
			});
			doConn.query('SELECT * FROM monsters_drops', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded monster drops');
				global.mondrops = results;
			});
			doConn.query('SELECT * FROM settings', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded game settings');
				global.gsettings = results;
			});
			doConn.query('SELECT * FROM locations', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded locations');
				global.locations = results;
			});
			doConn.query('SELECT * FROM locations_places', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded location places');
				global.locPlaces = results;
			});
			doConn.query('SELECT * FROM beasts', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded beasts');
				global.beasts = results;
			});
			doConn.query('SELECT * FROM story', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded story');
				story = results;
			});
			doConn.query('SELECT * FROM reputation_ranks', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded reputation ranks');
				global.reputation_ranks = results;
			});
			doConn.query('SELECT * FROM shops', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded shops');
				global.shops = results;
			});
			doConn.query('SELECT * FROM shops_items', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded shop items');
				global.shopitems = results;
			});
			doConn.query('SELECT * FROM items_requirements', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded item requirements');
				global.itemreqs = results;
			});
			doConn.query('SELECT * FROM dungeons', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded dungeons');
				dungeons = results;
			});
			doConn.query('SELECT * FROM dungeons_monsters', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded dungeon monsters');
				global.dungeons_monsters = results;
			});
			doConn.query('SELECT * FROM dungeons_drops', function(error, results) {
				if (error) {
					return error;
				}
				console.log('[MYSQL] Loaded dungeon drops');
				global.dungeons_drops = results;
			});
		});
	}
	return doConn;
}

module.exports = connectDB();