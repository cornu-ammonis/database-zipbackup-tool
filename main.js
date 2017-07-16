var backup = require('./backupGenerator.js');
var logger = require('./logger.js');

function generateBackupsIfThreeAM() {
	console.log('checking date');
	let d = new Date();
	let h = d.getHours();
	console.log(h);
	console.log(d);

	// note: the docker daemon reports a time 4 hours ahead of EST, 
	// which is why this number is 7
	// todo: more elegantly read in current time from docker.
	if (h === 3) {
		console.log('updating')
		try {
			backup.updateBackups();
		}
		catch(e) {
			logger.errorLog('error updating backups ' + e.message + '\n' + e.stack);
		}
		
	}
}

generateBackupsIfThreeAM();

//check once per hour
setInterval(generateBackupsIfThreeAM, 1000 * 60 * 60);