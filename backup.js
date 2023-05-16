const { spawn } = require('child_process');
const fs = require('fs');
const zlib = require('zlib');

const backupFileName = '/var/www/auto-upload-gdrive/database_backup.sql.gz';
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'username',
  database: 'database',
  password: 'passsword',
};
if (fs.existsSync(backupFileName)) {
  fs.unlinkSync(backupFileName);
  console.log(`database_backup.sql has been deleted`);
}
const ignoreTable = '--ignore-table=' + dbConfig.database + '.requests';
const backupProcess = spawn('mysqldump', [`-hlocalhost`, '-uroot_backup','--password=password',`${ignoreTable}`, dbConfig.database]);

const writeStream = fs.createWriteStream(backupFileName);
const gzip = zlib.createGzip();

backupProcess.stdout.pipe(gzip).pipe(writeStream);
backupProcess.on('exit', () => {
    console.log('Backup created successfully!');
});