const logs = require('@aws-cdk/aws-logs')
const dynamoDB = require('@aws-cdk/aws-dynamodb')
const { S3EventSource } = require('@aws-cdk/aws-lambda-event-sources');
const s3 = require('@aws-cdk/aws-s3')
const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const iam = require('@aws-cdk/aws-iam');
const apigateway = require('@aws-cdk/aws-apigateway');
const { PassthroughBehavior, ResponseType } = require('@aws-cdk/aws-apigateway');
const { ManagedPolicy, ServicePrincipal } = require('@aws-cdk/aws-iam');
const { LogGroup } = require('@aws-cdk/aws-logs');
const { AutoDeleteBucket } = require('@mobileposse/auto-delete-bucket')

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

   


    // lambdaDbUpdateRole
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
    }));

    // Bucket access
    
    lambdaDbUpdateRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:*'],
      resources: ['*']
    }));

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


    // CREATE RESOURCES::

    const ingestBucket = new AutoDeleteBucket(this, 'react-ingest-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      
    })


    const database = new dynamoDB.Table(this, 'Test-table', {
      partitionKey: { name: 'email', type: dynamoDB.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const tableName = database.tableName

    const dbInsertLambda =  new lambda.Function(this, 'react-dynamoDB-insert', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'react-dynamoDB-insert.handler',
      role: lambdaDbIngestRole,
      environment: { "TABLE_NAME": tableName },
      logRetention: 7
    });

    
    dbInsertLambda.addEventSource(new S3EventSource(ingestBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    }));

    

    const lambdaDbUpdate = new lambda.Function(this, 'dashboardUpdate', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'dashboardUpdate.handler',
      role: lambdaDbUpdateRole,
      environment: { "TABLE_NAME": tableName },
      logRetention: 7
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
    const getDbScanIntegration = new apigateway.LambdaIntegration(lambdaDbUpdate, {
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
