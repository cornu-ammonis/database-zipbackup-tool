# database-zipbackup-tool
***GENERAL USAGE***
start with 

```node main.js $hoursDelay $hoursInterval```

where **{hoursDelay}** is the number of hours to wait before attempting to generate backups. After that hoursDelay and the initial backup generation, the tool will wait for **{hoursInterval}** hours before attempting to generate backups again. If hourshoursDelay is undefined or 0, the first backup will happen after 10 seconds. If hoursIntervalHours is undefined, default is 24 hours between backups.
	
I used this setup because the server to which i deployed this app was set to a different time zone than mine.
Setting the backup time relative to current time meant i didnt need to worry about converting times. 
        
***DOCKER USAGE***
	you must mount the directories containing backups at /app/backups and the directory where zips should output
	  at /app/zips
