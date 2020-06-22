const numeral = require('numeral');

module.exports = function(amount) {
    var total = '';
    var platinum = Math.floor(amount / 1000000);
    var gold = Math.floor((amount - (platinum * 1000000)) / 10000);
    var silver = Math.floor((amount - (platinum * 1000000) - (gold * 10000)) / 100);
    var copper = amount - (platinum * 1000000) - (gold * 10000) - (silver * 100);

    if (platinum > 0) {
        total = '<span title="platinum" style="color:#e5e4e2">' + numeral(platinum).format('0,0') + 'p</span> <span title="gold" style="color:#FFD700">' + gold + 'g</span> <span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum == 0 && gold > 0) {
        total = '<span title="gold" style="color:#FFD700">' + gold + 'g</span> <span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum == 0 && gold == 0 && silver > 0) {
        total = '<span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum == 0 && gold == 0 && silver == 0) {
        total = '<span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    return total;
}