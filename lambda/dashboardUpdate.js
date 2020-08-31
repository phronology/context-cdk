const AWS = require('aws-sdk');
const dbClient = new AWS.DynamoDB.DocumentClient({region : 'eu-west-2'})


exports.handler = function (event, context, callback) {
 
    let scanningParams = {
        TableName: process.env.TABLE_NAME
    };
    

    if (event.httpMethod == 'GET') {
        dbClient.scan(scanningParams, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                const response = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*"
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

        const keyCheck = function (keyArr) {
            for (let k in keyArr) {
                if (k != 'email') {
                    return k
                }
            }
        }

        const postKey = keyCheck(body.payload.Item)
        const postVal = body.payload.Item[postKey]
        const email = body.payload.Item.email
        const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "email": email
        },
        UpdateExpression: `SET ${postKey} = :ma`,
        ExpressionAttributeValues: {
            ":ma": postVal,
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
