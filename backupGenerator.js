var AdmZip = require('adm-zip');

exports.manuallyTriggerBackupGeneration = function () {
	const { exec } = require('child_process');
	exec('docker exec -it kobodocker_kobocat_1 /srv/src/kobocat/docker/backup_media.bash', (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    return;
	  }

	  // the *entire* stdout and stderr (buffered)
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	});
}