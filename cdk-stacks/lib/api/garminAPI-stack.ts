/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-new */
import {NestedStack, type NestedStackProps, Duration, CfnOutput} from 'aws-cdk-lib';

import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as apigw2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigw2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as apigw2Authorizers from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import {type CfnStage} from 'aws-cdk-lib/aws-apigatewayv2';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import type * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {type Construct} from 'constructs';
import {NagSuppressions} from 'cdk-nag';

export type GarminApiProps = {
	cdkAppName: string;
	messageTable: dynamodb.ITable;
	allowedOrigins: string[];
	ssmParamHierarchy: string;
} & NestedStackProps;

export class GarminApiStack extends NestedStack {
	public httpApi: apigw2.IHttpApi;

	constructor(scope: Construct, id: string, props: GarminApiProps) {
		super(scope, id, props);

		// Create Lambda function for receiving calls to GarminAPI
		const processGarminMessage = new nodeLambda.NodejsFunction(this, 'ProcessGarminMessageLambda', {
			functionName: `${props.cdkAppName}-ProcessGarminMessageLambda`,
			entry: 'lambdas/handlers/processGarminMessageHandler.js',
			timeout: Duration.seconds(20),
			environment: {
				TABLE_NAME: props.messageTable.tableName,
			},
			runtime: Runtime.NODEJS_18_X,
		});
		props.messageTable.grantWriteData(processGarminMessage);

		// Create auth token secret to use with Garmin Portal Connect
		// Note garmin limits the format of the secret so this follows their rules
		const apiAuthToken = new secrets.Secret(this, 'GarminApiAuthToken', {
			description: 'Auth token for Garmin API. Copy this into Garmin Portal Connect',
			generateSecretString: {
				excludePunctuation: true,
			},
		});

		// Create auth Lambda function
		const garminAuthFunction = new nodeLambda.NodejsFunction(this, 'GarminAuthFunction', {
			functionName: `${props.cdkAppName}-GarminAuthLambda`,
			entry: 'lambdas/handlers/garminAuthHandler.js',
			timeout: Duration.seconds(20),
			environment: {
				SECRET_NAME: apiAuthToken.secretArn,
			},
			runtime: Runtime.NODEJS_18_X,
		});
		apiAuthToken.grantRead(garminAuthFunction);

		const garminApi = new apigw2.HttpApi(this, 'GarminAPI', {
			apiName: `${props.cdkAppName}-GarminAPI`,
			corsPreflight: {
				allowOrigins: props.allowedOrigins,
				allowMethods: [apigw2.CorsHttpMethod.GET, apigw2.CorsHttpMethod.POST],
				allowHeaders: apigw.Cors.DEFAULT_HEADERS,
			},
			createDefaultStage: false,
		});

		// Add prod stage with rate limiting
		const prodStage = garminApi.addStage('prod', {
			autoDeploy: true,
			stageName: 'prod',
			throttle: {
				burstLimit: 2,
				rateLimit: 2,
			},
		});

		// Setup the access log for APIGWv2
		const apiAccessLogs = new logs.LogGroup(this, `${props.cdkAppName}-GarminAPI-AccessLogs`);

		const stage = prodStage.node.defaultChild as CfnStage;
		stage.accessLogSettings = {
			destinationArn: apiAccessLogs.logGroupArn,
			format: JSON.stringify({
				requestId: '$context.requestId',
				userAgent: '$context.identity.userAgent',
				sourceIp: '$context.identity.sourceIp',
				requestTime: '$context.requestTime',
				requestTimeEpoch: '$context.requestTimeEpoch',
				httpMethod: '$context.httpMethod',
				path: '$context.path',
				status: '$context.status',
				protocol: '$context.protocol',
				responseLength: '$context.responseLength',
				domainName: '$context.domainName',
				authorizerError: '$context.authorizer.error',
				errorMessage: '$context.error.message',
				integrationStatus: '$context.integration.status',
				integrationError: '$context.integration.error',
			}),
		};

		const garminApiAuthorizer = new apigw2Authorizers.HttpLambdaAuthorizer('LambdaAuthorizer', garminAuthFunction, {
			responseTypes: [apigw2Authorizers.HttpLambdaResponseType.IAM],
			resultsCacheTtl: Duration.minutes(30),
			identitySource: ['$request.header.x-outbound-auth-token'],
		});

		// Create Lambda integrations
		const postGarminMessagesIntegration = new apigw2Integrations.HttpLambdaIntegration('PostGarminMessagesIntegration', processGarminMessage);

		// Define messages and maps API resource
		garminApi.addRoutes({
			integration: postGarminMessagesIntegration,
			path: '/messages',
			methods: [apigw2.HttpMethod.POST],
			authorizer: garminApiAuthorizer,
		});

		const ssmParam = new ssm.StringParameter(this, 'garminApiSSMParam', {
			parameterName: `${props.ssmParamHierarchy}garminApiEndpoint`,
			stringValue: garminApi.apiEndpoint,
		});

		new CfnOutput(this, 'GarminAPI Auth Token Secret ARN', {value: apiAuthToken.secretArn});

		this.httpApi = garminApi;

		// CDK-nag suppressions
		NagSuppressions.addResourceSuppressions(
			[processGarminMessage, garminAuthFunction],
			[
				{
					id: 'AwsSolutions-IAM4',
					reason: 'Choosing to trust AWS managed policies for this usecase.',
				},
			],
			true,
		);

		NagSuppressions.addResourceSuppressions(
			apiAuthToken,
			[
				{
					id: 'AwsSolutions-SMG4',
					reason: 'Garmin messaging API does not easily support secret rotation',
				},
			],
		);
	}
}
