/* 
USAGE:
	start with 'node main.js {hoursDelay} {hoursIntervalHours}'
	where {hoursDelay} is the number of hours to wait before attempting to generate backups.
	after that hoursDelay and the initial backup generation, the tool will wait for {hoursInterval} hours before
	attempting to generate backups again.

	if hourshoursDelay is undefined or 0, the first backup will happen immediately. if hoursIntervalHours is undefined, 
	default is 24 hours between backups.
	
	this setup is a workaround for the fact that docker containers can report a distinct time from
	the machine on which they are run, which can cause unexpected behavior when attempting to specify backup-time
	directly rather than relative to current time (as in this approach). the other method requires that the user be aware
	of the time internal to the docker container, which is needless opacity circumvented by using relative time.
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



var args = process.argv.slice(2);
var hoursDelay;
var hoursInterval;

if (args.length == 0) {
	hoursDelay = 0;
	hoursInterval = 24;

	console.log('defaulting to immediate backup and 24 hour hoursInterval');
}
else if (args.length == 1) {
	if (isNaN(args[0])) {
		console.log('you didnt enter a number for the hoursDelay, defaulting to generate backups after 10 seconds');
		hoursDelay = .00277;
	}
	else {
		hoursDelay = parseInt(args[0]);
	}

	hoursInterval = 24;
}
else if (args.length > 1) {
	
	if (isNaN(args[0])) {
		console.log('you didnt enter a number for the hoursDelay, defaulting to generate backups after 10 seconds');
		hoursDelay = .00277;
	}
	else {
		hoursDelay = parseInt(args[0]);
	}

	if (isNaN(args[1])) {
		console.log('you didnt enter a number for hoursInteravl, defaulting to 24');
		hoursInterval = 24
	}
	else {
		hoursInterval = parseInt(args[1]);
	}
}

console.log('starting setTimeout with ' + hoursDelay + 
	' hours of delay and a ' + hoursInterval + ' hour interval between successive backups');

setTimeout(firstBackupAndStartInterval.bind(null, hoursInterval), hoursDelay * 60 * 60 * 1000); 
