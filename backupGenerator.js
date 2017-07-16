var AdmZip = require('adm-zip');
var logger = require('./logger.js');
const fs = require('fs.extra');
const path = require('path')

// produces string representation of the date in the following format:
//    year-month-day-hour-minute
function getCurrentDateString() {
		let date = new Date();
		let dateString = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
			(date.getHours() + 1) + "-" + (date.getMinutes() + 1);

		return dateString;
}

// used to parse the integer value for the day in a datestring, 
//   for the purposes of determining the age of zip files named with the datestring
function getIntegerDayFromDateString(ds) {

	let dashCount = 0;
	let dayString = '';
	let i = 0
	
	while(i < ds.length) {
		
		if (ds[i] === '-'){
			dashCount += 1;

			// past the day portion of the string; end
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
// 
// returns only those entries within srcpath which are themselves directories
function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

// writes contents at ./backups to ./zips/ with name as the file name
// TYPICAL USEAGE: name should be getCurrentDateString()
//		we dont simply cal getCurrentDateString here because the function calling this one 
//      needs the exact name to verify that the zip was created properly
// note -- AdmZip sometimes fails on e.g. image files, but has worked fine on hte tar files which 
// this will be used for.
function createZipFromBackupDirectories(name) {

	let zip = new AdmZip();

	zip.addLocalFolder('./backups/');
	zip.writeZip('./zips/' + name);
}

// removes a file specified by path if it is a valid file 
// used to filter out those entries sometimes returned by fs.readirSync which arent actually files
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

// returns true if filename ends with '.zip'
function isZip(filename) {

	// last 4 characters in filename
	let ss = filename.slice(filename.length-4, filename.length);

	return ss === '.zip';
}

// deletes the zip specified by filename found in the ./zips/ directory
function deleteZip(filename) {
	let path = './zips/' + filename;

	if (fs.existsSync(path)) {
		fs.unlinkSync(path);
	}
}

// checks if a file specified by filename is at least two weeks old and deletes if so 
// NOTE: checks age by parsing the filename itself, not metadata
function deleteIfOlderThanTwoWeeks(filename, currentDayInt) {
	let fileDayInt = getIntegerDayFromDateString(filename.slice(0, filename.length-4));

	if (fileDayInt <= currentDayInt) {
		if ((currentDayInt - fileDayInt) >= 14) {
			deleteZip(filename);
		} 
	}
	// edge case: new month
	else {
		if (((31 - fileDayInt) + currentDayInt) >= 15) {
			deleteZip(filename);
		}
	}
}

// checks all zips in the './zips' folder and deletes those which are at least 2 weeks old
function removeZipFilesOlderThanTwoWeeks() {
	let currentDayInt = getIntegerDayFromDateString(getCurrentDateString());

	let files = fs.readdirSync('./zips/');

	for (let i = 0; i < files.length; i++) {
		if (isZip(files[i])) {
			deleteIfOlderThanTwoWeeks(files[i], currentDayInt);
		}
	}
}

// creates a new zip file containing the contents of the ./backups/ directory.
// deletes contents of ./backups/ if it confirms that the zip file was successfully 
// created. also clears zip files older than two weeks
//
// NOTE  - this is the only function exposed by exports, and is the way which main 
// will initiate backup generation 
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

		logger.log(logstring); // log info about each entry in new zip

		if (zipEntries.length >= 6) {
			removeUnzippedBackupFiles();
		}
		else {
			logger.errorLog('not enough entries in backup zip; not deleting backup files');
		}
		
	}
	else {
		logger.errorLog('tried creating new zip but no new zip found - not deleting backup files');
	}

	try {
		removeZipFilesOlderThanTwoWeeks();
	}
	catch (e) {
		logger.errorLog(' error removing zip files: ' + e.message + e.stack);
	}
}

testDayStringConverter = function() {
	console.log(getIntegerDayFromDateString(getCurrentDateString()));

	console.log(getIntegerDayFromDateString('2017-7-04-16-48'))

	console.log(getIntegerDayFromDateString('2017-7-4-16-48'))
}