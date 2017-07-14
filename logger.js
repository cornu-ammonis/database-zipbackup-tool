var fs = require('fs.extra');

exports.log = function(message) {
	fs.appendFileSync('./backups/backuplog.txt', message);
}