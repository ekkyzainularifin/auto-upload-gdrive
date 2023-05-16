const { google } = require('googleapis');
const date  = require('date-and-time');
const { OAuth2 } = google.auth;
const fs = require('fs');

const key = require('/var/www/auto-upload-gdrive/credentials.json');

// Replace with your own client ID and client secret
const CLIENT_ID = '###';
const CLIENT_SECRET = '###';


const dateFormatted = () => {
    const now  =  new Date();
    const value = date.format(now,'YYYY-MM-DD-HHmmss');
    return value;
};

// Create an instance of the Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({
  version: 'v3',
  auth: auth,
});

const fileMetadata = {
  name: dateFormatted()+'.sql.gz',
  parents: ['1Z7cyNYqAmTZ7xhI7FOXJnXOhTIloknb8'] //Folder google drive id
};
const media = {
  mimeType: 'application/gzip',
  body: fs.createReadStream('/var/www/auto-upload-gdrive/database_backup.sql.gz'),
};

drive.files.create({
  resource: fileMetadata,
  media: media,
  fields: 'id',
}, (err, file) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`File ID: ${file.data.id}`);
  }
});