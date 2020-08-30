const AWS = require('aws-sdk');
const dbClient = new AWS.DynamoDB.DocumentClient({region : 'eu-west-2'})


exports.handler = function (event, context, callback) {
 
    let scanningParams = {
        TableName: process.env.TABLE_NAME
    };
    
    
    // const report_generated = event.payload.Item.report_generated
    // const bolt_ons = event.payload.Item.bolt_ons
    // const active = event.payload.Item.active

    


    if (event.httpMethod == 'GET') {
        dbClient.scan(scanningParams, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                const response = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*"
                        // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                        // "Access-Control-Allow-Methods": "OPTIONS,GET",
                        // 'Content-Type': "application/json"
                    },
                    "body": JSON.stringify(data.Items),
                    "isBase64Encoded": false
                };
                callback(null, response);
            };
        })
    } else if (event.httpMethod == 'POST') {
        
        const body = JSON.parse(event.body)
        console.log(body)
        const approval = body.payload.Item.manual_approval
        const email = body.payload.Item.email
        const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "email": email
        },
        UpdateExpression: "set manual_approval = :ma",
        ExpressionAttributeValues: {
            ":ma": approval, // use API post value
        },
        ReturnValues: "UPDATED_NEW"
    };
        console.log("Updating the item...");
        dbClient.update(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(err, null, 1);
            } else {
                let data = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*"
                    },
                    "body": JSON.stringify('Hello from Lambda!'),
                    "isBase64Encoded": false
                };
                callback(data, null, 1);
            };
        });
    }
}
