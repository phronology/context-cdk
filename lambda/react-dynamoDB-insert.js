'use strict'

var AWS = require('aws-sdk'),
    mydocumentClient = new AWS.DynamoDB.DocumentClient(),
    s3Client = new AWS.S3();
    
exports.handler = function(event,context,callback){
    // Parse the JSON from S3
    console.log(event.Records[0].s3.object);
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = event.Records[0].s3.object.key
    

    
    
    readFile(srcBucket, srcKey, readFileContent, onError);
        };
        
function readFile (bucketName, filename, onFileContent, onError) {
    var params = { Bucket: bucketName, Key: filename };
    s3Client.getObject(params, function (err, data) {
        if (!err) 
            onFileContent(filename, data.Body);
        else
            console.log(err);
    });
}

function readFileContent(filename, content) {
    const parsedContent = JSON.parse(content);
    console.log(parsedContent.email);
     var params = {
        Item : {
                "reference": parsedContent.reference,
                "environment": parsedContent.environment,
                "name": parsedContent.name,
                "dob": parsedContent.dob,
                "email": parsedContent.email,
                "phone": parsedContent.phone,
                "address": parsedContent.address,
                "use_defaults": parsedContent.use_defaults,
                "tabs_order": parsedContent.tabs_order,
                "send_choice": parsedContent.send_choice,
                "user": parsedContent.user,
                "note": parsedContent.note,
                "scope": parsedContent.scope,
                "callback_uri": parsedContent.callback_uri,
                "redirect_uri": parsedContent.redirect_uri,
                "mandatory": parsedContent.mandatory,
                "started": parsedContent.started,
                "application_status": parsedContent.application_status,
                "link_expiry": parsedContent.link_expiry,
                "created": parsedContent.created,
                "completed": parsedContent.completed,
                "result": parsedContent.result,
                "manual_approval": parsedContent.manual_approval
    },
        TableName : process.env.TABLE_NAME
        };
    mydocumentClient.put(params,function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });
            }
    
function onError (err) {
    console.log('error: ' + err);
}            
    
  
    