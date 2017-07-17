var fs = require('fs.extra');

function getCurrentDateString() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
}

exports.log = function(message) {
	fs.appendFileSync('./zips/backuplog.txt', getCurrentDateString() + '\n' + message + '\n');
}

exports.errorLog = function(message) {
	fs.appendFileSync('./zips/errorlog.txt', getCurrentDateString() + '\n' + message + '\n');
}