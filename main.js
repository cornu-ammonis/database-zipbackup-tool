/* 
GENERAL USAGE:
	start with 'node main.js {hoursDelay} {hoursIntervalHours}'
	where {hoursDelay} is the number of hours to wait before attempting to generate backups.
	after that hoursDelay and the initial backup generation, the tool will wait for {hoursInterval} hours before
	attempting to generate backups again.

	if hourshoursDelay is undefined or 0, the first backup will happen after 10 seconds. if hoursIntervalHours is undefined, 
	default is 24 hours between backups.
	
	i used this setup because the server to which i deployed this app was set to a different time zone than mine.
	setting the backup time relative to current time meant i didnt need to worry about converting times. 

DOCKER USAGE:
	you must mount the directories containing backups at /app/backups and the directory where zips should output
	  at /app/zips
*/


var backup = require('./backupGenerator.js');
var logger = require('./logger.js');

function generateBackups() {


	console.log('attempting backup generation...')
	try {
		backup.updateBackups();
	}
	catch(e) {
		logger.errorLog('error updating backups ' + e.message + '\n' + e.stack);
	}
		
}

// runs backup, then starts setInterval with given hoursInterval delay
function firstBackupAndStartInterval(_hoursInterval) {
	generateBackups();

	setInterval(generateBackups, _hoursInterval * 60 * 60 * 1000)
}


// remove 'node' and 'main.js' from arguments list so that needed arguments
// will start at [0]
var args = process.argv.slice(2);

// defaults
var hoursDelay = 0.01667; // equivalent to ~60 seconds, gives user chance to abort
var hoursInterval = 24;

// case where user provides no arguments
if (args.length == 0) {
	
	//defaults
	console.log('defaulting to immediate backup and 24 hour hoursInterval');
}

// case where user only provides delay argument
else if (args.length == 1) {
	if (isNaN(args[0])) {
		console.log('you didnt enter a number for the hoursDelay, defaulting to generate backups after 10 seconds');
	}
	else {
		hoursDelay = parseInt(args[0]);
	}

}

// case where user provides delay and hoursinterval argument
else if (args.length > 1) {
	
	if (isNaN(args[0])) {
		console.log('you didnt enter a number for the hoursDelay, defaulting to generate backups after 10 seconds');
	}
	else {
		hoursDelay = parseInt(args[0]);
	}

	if (isNaN(args[1])) {
		console.log('you didnt enter a number for hoursInterval, defaulting to 24');
	}
	else {
		hoursInterval = parseInt(args[1]);
	}
}

console.log('starting setTimeout with ' + hoursDelay + 
	' hours of delay and a ' + hoursInterval + ' hour interval between successive backups');

setTimeout( firstBackupAndStartInterval.bind(null, hoursInterval) , hoursDelay * 60 * 60 * 1000); 
