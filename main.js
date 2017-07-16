/* 
USAGE:
	start with 'node main.js {hoursDelay} {intervalHours}'
	where {hoursDelay} is the number of hours to wait before attempting to generate backups.
	after that delay and the initial backup generation, the tool will wait for {interval} hours before
	attempting to generate backups again.

	if hoursDelay is undefined or 0, the first backup will happen immediately. if intervalHours is undefined, 
	default is 24 hours between backups.
	
	this setup is a workaround for the fact that docker containers can report a distinct time from
	the machine on which they are run, which can cause unexpected behavior when attempting to specify backup-time
	directly rather than relative to current time (as in this approach). the other method requires that the user be aware
	of the time internal to the docker container, which is needless opacity circumvented by using relative time.
*/


var backup = require('./backupGenerator.js');
var logger = require('./logger.js');

var args = process.argv.slice(2);

function generateBackups() {


	console.log('attempting backup generation...')
	try {
		backup.updateBackups();
	}
	catch(e) {
		logger.errorLog('error updating backups ' + e.message + '\n' + e.stack);
	}
		
}


setInterval(generateBackupsIfThreeAM, 1000 * 60 * 60);