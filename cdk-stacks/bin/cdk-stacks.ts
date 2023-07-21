#!/usr/bin/env node

import {App, Stack, type StackProps} from 'aws-cdk-lib';
import {FrontendInfrastructureStack} from '../lib/frontend-infrastructure-stack';
import {BackendInfrastructureStack} from '../lib/backend-infrastructure-stack';
import {loadSSMParams} from '../lib/infrastructure/ssm-params-util';
import {AwsSolutionsChecks} from 'cdk-nag';
import {Aspects} from 'aws-cdk-lib';

import * as configParams from '../config.params.json';

const app = new App();
Aspects.of(app).add(new AwsSolutionsChecks({verbose: true}));

const backendInfraStack = new BackendInfrastructureStack(app, 'BackendInfraStack', {
	cdkAppName: configParams.CdkAppName,
	ssmParamHierarchy: configParams.hierarchy,
	env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});

const frontendInfraStack = new FrontendInfrastructureStack(app, 'FrontendInfraStack', {
	frontendBuildPath: '../frontend/build',
	cdkAppName: configParams.CdkAppName,
	ssmParamsHierarchy: configParams.hierarchy,
	env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});
