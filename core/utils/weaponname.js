const data = require('../../config/weapons');

module.exports = function(val) {
	var weapons = data;
	if (val < 100) {
		var name = weapons.filter(function(e) {
			return e.grade == Math.floor(val / 10);
		});
	} else if (val >= 100 && val < 200) {
		var name = weapons.filter(function(e) {
			return e.grade == Math.floor(val / 10);
		});
	} else {
		var name = weapons[weapons.length - 1];
	}
	return name[0].name;
}