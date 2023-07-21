import {Stack, type StackProps} from 'aws-cdk-lib';
import {GarminApiStack} from './api/garminAPI-stack';
import {DynamodbStack} from './infrastructure/dynamodb-stack';
import {FrontendApiStack} from './api/frontendAPI-stack';
import {type Construct} from 'constructs';
import {loadSSMParams} from './infrastructure/ssm-params-util';
import {CognitoStack} from './infrastructure/cognito-stack';

export type BackendInfrastructureStackProps = {
	cdkAppName: string;
	ssmParamHierarchy: string;
} & StackProps;

export class BackendInfrastructureStack extends Stack {
	constructor(scope: Construct, id: string, props: BackendInfrastructureStackProps) {
		super(scope, id, props);

		const ssmParams = loadSSMParams(this);
		const domainName = ssmParams.frontendDomainName as string;
		const allowedOrigins = ssmParams.websiteAPIAllowedOrigins.split(',').map((item: string) => item.trim()) as string[];
		const certificateArn = ssmParams.acmCertificateArn as string;
		const googleClientSecretName = ssmParams.googleOauthClientSecretName as string;
		const googleClientId = ssmParams.googleOauthClientId as string;
		const hostedZoneId = ssmParams.hostedZoneId as string;

		const messageTableStack = new DynamodbStack(this, 'DynamoDBStack', {
			cdkAppName: props.cdkAppName,
		});

		const garminApiStack = new GarminApiStack(this, 'GarminAPIStack', {
			cdkAppName: props.cdkAppName,
			messageTable: messageTableStack.table,
			allowedOrigins,
			ssmParamHierarchy: props.ssmParamHierarchy,
		});
		// API stack needs to pass DynamoDB table to Lambdas
		garminApiStack.addDependency(messageTableStack);

		const cognitoStack = new CognitoStack(this, 'CognitoStack', {
			cdkAppName: props.cdkAppName,
			frontendDomainName: domainName,
			acmCertificateArn: certificateArn,
			googleClientId,
			googleClientSecretName,
			hostedZoneId,
			ssmParamHierarchy: props.ssmParamHierarchy,
		});

		const frontendApiStack = new FrontendApiStack(this, 'FrontendAPIStack', {
			cdkAppName: props.cdkAppName,
			messageTable: messageTableStack.table,
			domainName,
			allowedOrigins,
			ssmParamHierarchy: props.ssmParamHierarchy,
			userpool: cognitoStack.userpool,
			userpoolClient: cognitoStack.userpoolClient,
		});
	}
}
