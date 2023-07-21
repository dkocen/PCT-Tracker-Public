/* eslint-disable @typescript-eslint/naming-convention */
import {NestedStack, type NestedStackProps, Duration} from 'aws-cdk-lib';
import {type Construct} from 'constructs';
import {type ITable} from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as apigw2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigw2Integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {HttpUserPoolAuthorizer} from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import {type CfnStage} from 'aws-cdk-lib/aws-apigatewayv2';
import {type IUserPoolClient, type IUserPool} from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {NagSuppressions} from 'cdk-nag';

export type FrontendApiProps = {
	cdkAppName: string;
	messageTable: ITable;
	domainName: string;
	allowedOrigins: string[];
	ssmParamHierarchy: string;
	userpool: IUserPool;
	userpoolClient: IUserPoolClient;
} & NestedStackProps;

export class FrontendApiStack extends NestedStack {
	public httpApi: apigw2.IHttpApi;

	constructor(scope: Construct, id: string, props: FrontendApiProps) {
		super(scope, id, props);

		// Create Lambda function for getting GPS points from DDB
		const getGpsPoints = new lambda.NodejsFunction(this, 'GetGPSPointsLambda', {
			functionName: `${props.cdkAppName}-GetGPSPoints`,
			entry: 'lambdas/handlers/fetchGPSPointsHandler.js',
			timeout: Duration.seconds(20),
			environment: {
				TABLE_NAME: props.messageTable.tableName,
			},
			runtime: Runtime.NODEJS_18_X,
		});
		props.messageTable.grantReadData(getGpsPoints);

		// Create Lambda function for getting messages from DDB
		const getMessages = new lambda.NodejsFunction(this, 'getMessagesLambda', {
			functionName: `${props.cdkAppName}-GetMessages`,
			entry: 'lambdas/handlers/fetchFrontendMessagesHandler.js',
			timeout: Duration.seconds(20),
			environment: {
				TABLE_NAME: props.messageTable.tableName,
			},
			runtime: Runtime.NODEJS_18_X,
		});
		props.messageTable.grantReadData(getMessages);

		// Create Lambda function for posting message to DDB
		const postMessage = new lambda.NodejsFunction(this, 'postMessageLambda', {
			functionName: `${props.cdkAppName}-PostMessage`,
			entry: 'lambdas/handlers/postFrontendMessageHandler.js',
			timeout: Duration.seconds(20),
			environment: {
				TABLE_NAME: props.messageTable.tableName,
			},
			runtime: Runtime.NODEJS_18_X,
		});
		props.messageTable.grantWriteData(postMessage);

		const authorizer = new HttpUserPoolAuthorizer('FrontendAPIAuthorizer', props.userpool, {
			userPoolClients: [props.userpoolClient],
		});

		// Create frontend API
		const frontendApi = new apigw2.HttpApi(this, 'FrontendAPI', {
			apiName: `${props.cdkAppName}-FrontendAPI`,
			corsPreflight: {
				allowOrigins: props.allowedOrigins,
				allowMethods: [apigw2.CorsHttpMethod.GET, apigw2.CorsHttpMethod.POST],
				allowHeaders: apigw.Cors.DEFAULT_HEADERS,
			},
			createDefaultStage: false,
			defaultAuthorizer: authorizer,
		});

		// Add prod stage with rate limiting
		const prodStage = frontendApi.addStage('prod', {
			autoDeploy: true,
			stageName: 'prod',
			throttle: {
				burstLimit: 2,
				rateLimit: 2,
			},
		});

		// Setup the access log for APIGWv2
		const accessLogs = new logs.LogGroup(this, `${props.cdkAppName}-FrontendAPI-AccessLogs`);

		const stage = prodStage.node.defaultChild as CfnStage;
		stage.accessLogSettings = {
			destinationArn: accessLogs.logGroupArn,
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
			}),
		};

		// Create Lambda integrations
		const getMessagesIntegration = new apigw2Integrations.HttpLambdaIntegration('GetMessagesIntegration', getMessages);
		const postMessagesIntegration = new apigw2Integrations.HttpLambdaIntegration('PostMessagesIntegration', postMessage);
		const getGPSPointsIntegration = new apigw2Integrations.HttpLambdaIntegration('GetGPSPointsIntegration', getGpsPoints);

		// Define messages and maps API resource
		frontendApi.addRoutes({
			integration: getMessagesIntegration,
			path: '/messages',
			methods: [apigw2.HttpMethod.GET],
		});

		frontendApi.addRoutes({
			integration: postMessagesIntegration,
			path: '/messages',
			methods: [apigw2.HttpMethod.POST],
		});

		frontendApi.addRoutes({
			integration: getGPSPointsIntegration,
			path: '/gps',
			methods: [apigw2.HttpMethod.GET],
		});

		const ssmParam = new ssm.StringParameter(this, 'frontendApiSSMParam', {
			parameterName: `${props.ssmParamHierarchy}frontendApiEndpoint`,
			stringValue: `${frontendApi.apiEndpoint}/prod`,
		});

		this.httpApi = frontendApi;

		// CDK-nag suppressions
		NagSuppressions.addResourceSuppressions(
			[getGpsPoints, getMessages, postMessage],
			[
				{
					id: 'AwsSolutions-IAM4',
					reason: 'Choosing to trust AWS managed policies for this usecase.',
				},
			],
			true,
		);

		NagSuppressions.addResourceSuppressions(
			[frontendApi],
			[
				{
					id: 'AwsSolutions-APIG4',
					reason: 'These APIs are meant to be public. Abuse mitigated via throttling policy and following least privilege with Lambda backends',
				},
			],
			true,
		);
	}
}
