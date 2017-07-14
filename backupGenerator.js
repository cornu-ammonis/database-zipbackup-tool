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

function getIntegerDayFromDateString(ds) {

	let dashCount = 0;
	let dayString = '';
	let i = 0
	
	while(i < ds.length) {
		
		if (ds[i] === '-'){
			dashCount += 1;
			if (dashCount >= 3) {
				break;
			}

			// don't add a dash to the day string
			i += 1;
			continue;
		}

		if (dashCount === 2) {
			dayString += ds[i];
		}

		i += 1;
	}

	return parseInt(dayString);
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

function isZip(filename) {
	let ss = filename.slice(string.length-4, string.length);

	return ss === '.zip';
}

function deleteZip(filename) {}

function deleteIfOlderThanTwoWeeks(filename, currentDayInt) {
	let fileDayInt = getIntegerDayFromDateString(filename.slice(0, filename.length-4));

	if (fileDayInt < currentDayInt) {

	}
}

function removeZipFilesOlderThanTwoWeeks() {
	let currentDayInt = getIntegerDayFromDateString(getCurrentDateString());

	let files = fs.readdirSync('./zips/');

	for (let i = 0; i < files.length; i++) {
		if isZip(files[i]) {
			deleteIfOlderThanTwoWeeks(files[i], currentDayInt);
		}
	}
}

// creates a new zip file containing the contents of hte ./backups/ directory
// if it confirms that the zip file was successfully created. 
exports.updateBackups = function() {
	let nameOfNewZip = getCurrentDateString() + '.zip';

	createZipFromBackupDirectories(nameOfNewZip);

	if (fs.existsSync('./zips/' + nameOfNewZip)) {
		let zipCreated = new AdmZip('./zips/' + nameOfNewZip);
		let zipEntries = zipCreated.getEntries();
		logger.log('zip ' + nameOfNewZip + ' length ' + zipEntries.length);
		
		let logstring = "";
		zipEntries.forEach(function(zipEntry) {
	    	logstring += zipEntry.toString(); // outputs zip entries information
		});

		logger.log(logstring);

		if (zipEntries.length >= 6) {
			removeUnzippedBackupFiles();
		}
		else {
			logger.errorLog('not enough entries in backup zip; not deleting backup files');
		}
		
	}
	else {
		logger.errorLog('no zip found - not deleting backup files');
	}
}

exports.testDayStringConverter = function() {
	console.log(getIntegerDayFromDateString(getCurrentDateString()));

	console.log(getIntegerDayFromDateString('2017-7-04-16-48'))

	console.log(getIntegerDayFromDateString('2017-7-4-16-48'))
}