const dynamoDB = require('@aws-cdk/aws-dynamodb')
const { S3EventSource } = require('@aws-cdk/aws-lambda-event-sources');
const s3 = require('@aws-cdk/aws-s3')
const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const { PassthroughBehavior, ResponseType } = require('@aws-cdk/aws-apigateway');
const { ManagedPolicy, ServicePrincipal } = require('@aws-cdk/aws-iam');

class ContextCdkStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // CREATE IAM POLICIES::

    // lambdaDbIngestRole
    const lambdaDbIngestRole = new iam.Role(this, 'lambdaDbIngestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')   // required
    });

    // Logs creation
    lambdaDbIngestRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
  ],
      resources: ['*']
    }))



    // Bucket access
    lambdaDbIngestRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:*'],
      resources: ['*']
    }))


    // DynamoDB access
    lambdaDbIngestRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
                "dynamodb:*",
                "dax:*",
                "application-autoscaling:DeleteScalingPolicy",
                "application-autoscaling:DeregisterScalableTarget",
                "application-autoscaling:DescribeScalableTargets",
                "application-autoscaling:DescribeScalingActivities",
                "application-autoscaling:DescribeScalingPolicies",
                "application-autoscaling:PutScalingPolicy",
                "application-autoscaling:RegisterScalableTarget",
                "cloudwatch:DeleteAlarms",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:DescribeAlarmsForMetric",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:ListMetrics",
                "cloudwatch:PutMetricAlarm",
                "datapipeline:ActivatePipeline",
                "datapipeline:CreatePipeline",
                "datapipeline:DeletePipeline",
                "datapipeline:DescribeObjects",
                "datapipeline:DescribePipelines",
                "datapipeline:GetPipelineDefinition",
                "datapipeline:ListPipelines",
                "datapipeline:PutPipelineDefinition",
                "datapipeline:QueryObjects",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "iam:GetRole",
                "iam:ListRoles",
                "kms:DescribeKey",
                "kms:ListAliases",
                "sns:CreateTopic",
                "sns:DeleteTopic",
                "sns:ListSubscriptions",
                "sns:ListSubscriptionsByTopic",
                "sns:ListTopics",
                "sns:Subscribe",
                "sns:Unsubscribe",
                "sns:SetTopicAttributes",
                "lambda:CreateFunction",
                "lambda:ListFunctions",
                "lambda:ListEventSourceMappings",
                "lambda:CreateEventSourceMapping",
                "lambda:DeleteEventSourceMapping",
                "lambda:GetFunctionConfiguration",
                "lambda:DeleteFunction",
                "resource-groups:ListGroups",
                "resource-groups:ListGroupResources",
                "resource-groups:GetGroup",
                "resource-groups:GetGroupQuery",
                "resource-groups:DeleteGroup",
                "resource-groups:CreateGroup",
                "tag:GetResources"
    ],
      resources: ['*']
    }))

    // react-dynamoDB-insert-role

    const lambdaDbUpdateRole = new iam.Role(this, 'lambdaDbUpdateRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')   // required
    });


    // Logs creation
    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup'],
      resources: ['*']
    }))

    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogStream',
        'logs:PutLogEvents'
    ],
      resources: ['*']
    }))

    // DB access
    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
                "dynamodb:*",
                "dax:*",
                "application-autoscaling:DeleteScalingPolicy",
                "application-autoscaling:DeregisterScalableTarget",
                "application-autoscaling:DescribeScalableTargets",
                "application-autoscaling:DescribeScalingActivities",
                "application-autoscaling:DescribeScalingPolicies",
                "application-autoscaling:PutScalingPolicy",
                "application-autoscaling:RegisterScalableTarget",
                "cloudwatch:DeleteAlarms",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:DescribeAlarmsForMetric",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:ListMetrics",
                "cloudwatch:PutMetricAlarm",
                "datapipeline:ActivatePipeline",
                "datapipeline:CreatePipeline",
                "datapipeline:DeletePipeline",
                "datapipeline:DescribeObjects",
                "datapipeline:DescribePipelines",
                "datapipeline:GetPipelineDefinition",
                "datapipeline:ListPipelines",
                "datapipeline:PutPipelineDefinition",
                "datapipeline:QueryObjects",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "iam:GetRole",
                "iam:ListRoles",
                "kms:DescribeKey",
                "kms:ListAliases",
                "sns:CreateTopic",
                "sns:DeleteTopic",
                "sns:ListSubscriptions",
                "sns:ListSubscriptionsByTopic",
                "sns:ListTopics",
                "sns:Subscribe",
                "sns:Unsubscribe",
                "sns:SetTopicAttributes",
                "lambda:CreateFunction",
                "lambda:ListFunctions",
                "lambda:ListEventSourceMappings",
                "lambda:CreateEventSourceMapping",
                "lambda:DeleteEventSourceMapping",
                "lambda:GetFunctionConfiguration",
                "lambda:DeleteFunction",
                "resource-groups:ListGroups",
                "resource-groups:ListGroupResources",
                "resource-groups:GetGroup",
                "resource-groups:GetGroupQuery",
                "resource-groups:DeleteGroup",
                "resource-groups:CreateGroup",
                "tag:GetResources"
    ],
      resources: ['*']
    }))

    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudwatch:GetInsightRuleReport'
    ],
      resources: ['arn:aws:cloudwatch:*:*:insight-rule/DynamoDBContributorInsights*']
    }))

    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'iam:PassRole'
      ],
      resources: ['*'],
      conditions: {
        "StringLike": {
          "iam:PassedToService": [
            "application-autoscaling.amazonaws.com",
            "dax.amazonaws.com"
          ]
        }
      }
    }))

    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'iam:CreateServiceLinkedRole',
        'logs:PutLogEvents'
      ],
      resources: ['*'],
      conditions: {
        "StringEquals": {
          "iam:AWSServiceName": [
            "replication.dynamodb.amazonaws.com",
            "dax.amazonaws.com",
            "dynamodb.application-autoscaling.amazonaws.com",
            "contributorinsights.dynamodb.amazonaws.com"
          ]
        }
      }
    }));


    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "execute-api:Invoke",
        "execute-api:ManageConnections"
      ],
      resources: ["arn:aws:execute-api:*:*:*"]
    }))

    lambdaDbUpdateRole.grant(new iam.ServicePrincipal("apigateway.amazonaws.com"))


    // lambdaDbScanRole
    const lambdaDbScanRole = new iam.Role(this, 'lambdaDbScanRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')   // required
    });

    


    // Logs creation
    lambdaDbScanRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup'],
      resources: ['*']
    }))

    lambdaDbScanRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogStream',
        'logs:PutLogEvents'
      ],
      resources: ['*']
    }));

    // Bucket access
    
    lambdaDbScanRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:*'],
      resources: ['*']
    }));

    lambdaDbScanRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:*",
        "dax:*",
        "application-autoscaling:DeleteScalingPolicy",
        "application-autoscaling:DeregisterScalableTarget",
        "application-autoscaling:DescribeScalableTargets",
        "application-autoscaling:DescribeScalingActivities",
        "application-autoscaling:DescribeScalingPolicies",
        "application-autoscaling:PutScalingPolicy",
        "application-autoscaling:RegisterScalableTarget",
        "cloudwatch:DeleteAlarms",
        "cloudwatch:DescribeAlarmHistory",
        "cloudwatch:DescribeAlarms",
        "cloudwatch:DescribeAlarmsForMetric",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "cloudwatch:PutMetricAlarm",
        "datapipeline:ActivatePipeline",
        "datapipeline:CreatePipeline",
        "datapipeline:DeletePipeline",
        "datapipeline:DescribeObjects",
        "datapipeline:DescribePipelines",
        "datapipeline:GetPipelineDefinition",
        "datapipeline:ListPipelines",
        "datapipeline:PutPipelineDefinition",
        "datapipeline:QueryObjects",
        "ec2:DescribeVpcs",
        "ec2:DescribeSubnets",
        "ec2:DescribeSecurityGroups",
        "iam:GetRole",
        "iam:ListRoles",
        "kms:DescribeKey",
        "kms:ListAliases",
        "sns:CreateTopic",
        "sns:DeleteTopic",
        "sns:ListSubscriptions",
        "sns:ListSubscriptionsByTopic",
        "sns:ListTopics",
        "sns:Subscribe",
        "sns:Unsubscribe",
        "sns:SetTopicAttributes",
        "lambda:CreateFunction",
        "lambda:ListFunctions",
        "lambda:ListEventSourceMappings",
        "lambda:CreateEventSourceMapping",
        "lambda:DeleteEventSourceMapping",
        "lambda:GetFunctionConfiguration",
        "lambda:DeleteFunction",
        "resource-groups:ListGroups",
        "resource-groups:ListGroupResources",
        "resource-groups:GetGroup",
        "resource-groups:GetGroupQuery",
        "resource-groups:DeleteGroup",
        "resource-groups:CreateGroup",
        "tag:GetResources"
      ],
      resources: ['*']
    }));

     

    lambdaDbScanRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "execute-api:Invoke",
        "execute-api:ManageConnections"
      ],
      resources: ["arn:aws:execute-api:*:*:*"]
    }))

    lambdaDbScanRole.grant(new iam.ServicePrincipal("apigateway.amazonaws.com"))


    // CREATE RESOURCES::

    const ingestBucket = new s3.Bucket(this, 'react-ingest-bucket')

    const database = new dynamoDB.Table(this, 'Test-table', {
      partitionKey: { name: 'email', type: dynamoDB.AttributeType.STRING }
    });

    const tableName = database.tableName

    const dbInsertLambda =  new lambda.Function(this, 'react-dynamoDB-insert', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'react-dynamoDB-insert.handler',
      role: lambdaDbIngestRole,
      environment: {"TABLE_NAME" : tableName}
    });


    dbInsertLambda.addEventSource(new S3EventSource(ingestBucket, {
      events: [ s3.EventType.OBJECT_CREATED]
    }));

    const dbUpdateLambda = new lambda.Function(this, 'react-dynamoDB-update', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'react-dynamoDB-update.handler',
      role: lambdaDbUpdateRole,
      environment: {"TABLE_NAME" : tableName}
    });

    const lambdaDbScan = new lambda.Function(this, 'react-dynamoDB-scan', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'react-dynamoDB-scan.handler',
      role: lambdaDbScanRole,
      environment: {"TABLE_NAME" : tableName}
    });


    // API GATEWAY
    const apiRole = new iam.Role(this, 'apiRole', {
      roleName: 'apiRole',
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    
    apiRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction']
    }));
    

    // API GATEWAY + LAMBDA INTEGRATION
    const getDbScanIntegration = new apigateway.LambdaIntegration(lambdaDbScan, {
      proxy: true,
      allowTestInvoke: true,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
      integrationResponses: [
        {
          statusCode: "200"
        }],
      credentialsRole: apiRole,
      
    })

    const api = new apigateway.RestApi(this, 'cdk-react-api', {
      defaultIntegration: getDbScanIntegration,
    }
    );
    api.root.addMethod('GET');
    api.root.addMethod('POST');
    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS
    })
  }
}

module.exports = { ContextCdkStack }
