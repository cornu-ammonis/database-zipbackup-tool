var AdmZip = require('adm-zip');
var logger = require('./logger.js');
const fs = require('fs.extra');
const path = require('path')

function getCurrentDateString() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
	}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

exports.createZipFromBackupDirectory = function () {

	let zip = new AdmZip();

	zip.addLocalFolder('./backups/');
	zip.writeZip('./zips/' + getCurrentDateString() + '.zip');
}

exports.testWalkingDirectories = function() {
	let files = fs.readdirSync('./backups/');

	for (let i = 0; i < files.length; i++) {
		console.log(files[i]);
	}

	let dirs = getDirectories('./backups/');

	for (let i = 0; i < dirs.length; i++) {
		console.log(dirs[i]);
	}
}