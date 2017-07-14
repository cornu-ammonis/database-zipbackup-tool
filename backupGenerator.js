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

// from https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

// writes contents at ./backups to ./zips/ with getCurrentDateString.zip as the file name
// note -- AdmZip sometimes fails on e.g. image files, but has worked fine on hte tar files which 
// this will be used for.
function createZipFromBackupDirectories(name) {

	let zip = new AdmZip();

	zip.addLocalFolder('./backups/');
	zip.writeZip('./zips/' + name);
}

// removes a file specified by path if it is a valid file 
function removeFileIfExists(path) {

	console.log('checking ' + path);
	if (fs.existsSync(path)) {

		console.log('removing ' + path);
		fs.unlinkSync(path);
	}
}

// deletes files found in the subdirectories of ./backups/
function removeUnzippedBackupFiles() {
	let backupSubDirectories = getDirectories('./backups/');

	for (let i = 0; i < backupSubDirectories.length; i++) {
		let subdir = './backups/' + backupSubDirectories[i];

		let files = fs.readdirSync(subdir);

		for (let j = 0; j < files.length; j++) {
			removeFileIfExists(subdir + '/' + files[j]);
		}
	}
}

// creates a new zip file containing the contents of hte ./backups/ directory
// if it confirms that the zip file was successfully created. 
exports.updateBackups = function() {
	let nameOfNewZip = getCurrentDateString() + '.zip';

	createZipFromBackupDirectories(nameOfNewZip);

	if (fs.existsSync('./zips/' + nameOfNewZip)) {

		removeUnzippedBackupFiles();
	}
}