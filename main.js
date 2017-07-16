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