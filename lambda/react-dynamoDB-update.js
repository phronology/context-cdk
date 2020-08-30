
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region : 'eu-west-2'})

exports.handler = function(event,context,callback) {
    
    console.log(event.payload.Item)
    const approval = event.payload.Item.manual_approval
    const email = event.payload.Item.email
    const report_generated = event.payload.Item.report_generated
    const bolt_ons = event.payload.Item.bolt_ons
    const active = event.payload.Item.active
    

    // var docClient = new AWS.DynamoDB.DocumentClient({region : 'eu-west-2'})
    
    // Update the item, unconditionally,
    
    var params = {
        TableName: process.env.TABLE_NAME,
        Key:{
            "email": email
        },
        UpdateExpression: "set manual_approval = :ma",
        ExpressionAttributeValues:{
            ":ma":approval, // use API post value
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            callback(err, null, 1);
        } else {
            callback(data, null, 1);
        };
    });
    
}