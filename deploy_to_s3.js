
const fs = require('fs');
const AWS = require('aws-sdk');
const getFiles = require('node-recursive-directory');
const mime = require('mime');

const s3 = new AWS.S3({
    accessKeyId: "AKIA6P7POOTK74Y3SUMG",
    secretAccessKey: "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"
});

//const fileName = 'contacts.csv';

const uploadFile = (fileName,PREFIX) => {
    //console.log(fileName)
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     var base64data = new Buffer(data, 'binary');

     const params = {
         Bucket: 'crptocointracker', // pass your bucket name
         Key: fileName.substr(fileName.lastIndexOf(PREFIX) + PREFIX.length), 
         Body: base64data,
         ContentType:mime.getType(fileName)
     };
     /*
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log('File uploaded successfully at '+data.Location)
     });*/

     s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('File uploaded successfully : '+fileName  + " with content type:  " + mime.getType(fileName))
      }
    });

  });
};

//uploadFile("ayite");

//console.log(__dirname);

(async () => {
    const files = await getFiles('dist/');
    //console.log(files);
    files.forEach((file)=>{
        var PREFIX = "dist/";
        uploadFile(PREFIX +file.substr(file.lastIndexOf(PREFIX) + PREFIX.length),PREFIX);
    });
})()