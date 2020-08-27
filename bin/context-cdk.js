#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { ContextCdkStack } = require('../lib/context-cdk-stack');

const app = new cdk.App();
new ContextCdkStack(app, 'ContextCdkStack');
