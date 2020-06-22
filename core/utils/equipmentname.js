const data = require('../../config/equipment');

module.exports = function(val) {
	var equipments = data;
	if (val < 100) {
		var name = equipments.filter(function(e) {
			return e.grade == Math.floor(val / 10);
		});
	} else if (val >= 100 && val < 200) {
		var name = equipments.filter(function(e) {
			return e.grade == Math.floor(val / 10);
		});
	} else {
		var name = equipments[equipments.length - 1];
	}
	return name[0].name;
}