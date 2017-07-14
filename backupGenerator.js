var AdmZip = require('adm-zip');
var logger = require('./logger.js');
var fs = require('fs.extra');

function getCurrentDateString() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
	}

exports.createZipFromBackupDirectory = function () {

	let zip = new AdmZip();

	zip.addLocalFolder('./backups/');
	zip.writeZip('./zips/' + getCurrentDateString() + '.zip');
}

exports.testWalkingDirectories = function() {
	files = fs.readdirSync('./backups/');

	for (let i = 0; i < files.length; i++) {
		console.log(files[i]);
	}
}