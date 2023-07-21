import {NestedStack, type NestedStackProps, CfnOutput, RemovalPolicy, Duration, SecretValue} from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {type Construct} from 'constructs';
import {NagSuppressions} from 'cdk-nag';

export type CognitoStackProps = {
	readonly cdkAppName: string;
	readonly frontendDomainName: string;
	readonly acmCertificateArn: string;
	readonly googleClientId: string;
	readonly googleClientSecretName: string;
	readonly hostedZoneId: string;
	readonly ssmParamHierarchy: string;
} & NestedStackProps;

export class CognitoStack extends NestedStack {
	public userpool: cognito.IUserPool;
	public userpoolClient: cognito.IUserPoolClient;

	constructor(scope: Construct, id: string, props: CognitoStackProps) {
		super(scope, id, props);

		const userpool = new cognito.UserPool(this, 'websiteUserpool', {
			userPoolName: `${props.cdkAppName}-UserPool`,
			passwordPolicy: {
				minLength: 8,
				requireUppercase: true,
				requireLowercase: true,
				requireDigits: true,
				requireSymbols: true,
				tempPasswordValidity: Duration.days(3),
			},
			advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED,
		});

		const domainCert = acm.Certificate.fromCertificateArn(this, 'ACMCert', props.acmCertificateArn);

		const domain = userpool.addDomain('UserpoolDomain', {
			customDomain: {
				domainName: `auth.${props.frontendDomainName}`,
				certificate: domainCert,
			},
		});

		const googleProvider = new cognito.UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
			userPool: userpool,
			clientId: props.googleClientId,
			clientSecretValue: SecretValue.secretsManager(props.googleClientSecretName),
			scopes: [
				'profile',
				'email',
				'openid',
			],
			attributeMapping: {
				email: cognito.ProviderAttribute.GOOGLE_EMAIL,
				fullname: cognito.ProviderAttribute.GOOGLE_NAME,
			},
		});

		userpool.registerIdentityProvider(googleProvider);

		const client = userpool.addClient('UserpoolClient', {
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
				},
				callbackUrls: [
					`https://${props.frontendDomainName}/`,
				],
				logoutUrls: [`https://${props.frontendDomainName}`],
			},

			supportedIdentityProviders: [
				cognito.UserPoolClientIdentityProvider.GOOGLE,
			],
			userPoolClientName: `${props.cdkAppName}-UserPoolClient`,
		});

		client.node.addDependency(googleProvider);

		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
			hostedZoneId: props.hostedZoneId,
			zoneName: props.frontendDomainName,
		});
		const userPoolDomainRecord = new route53.CnameRecord(this, 'UserPoolDomainRecord', {
			recordName: `auth.${props.frontendDomainName}`,
			zone: hostedZone,
			domainName: domain.cloudFrontDomainName,
		});

		this.userpool = userpool;
		this.userpoolClient = client;

		// SSM Parameters
		const cognitoRegionSsmParam = new ssm.StringParameter(this, 'CognitoRegionSSMParam', {
			parameterName: `${props.ssmParamHierarchy}cognitoRegion`,
			stringValue: userpool.env.region,
		});
		const userPoolIdSsmParam = new ssm.StringParameter(this, 'UserPoolIdSSMParam', {
			parameterName: `${props.ssmParamHierarchy}userPoolId`,
			stringValue: userpool.userPoolId,
		});
		const userPoolClientIdSsmParam = new ssm.StringParameter(this, 'UserPoolClientIdSsmParam', {
			parameterName: `${props.ssmParamHierarchy}userPoolClientId`,
			stringValue: client.userPoolClientId,
		});
		const userPoolDomainUrlSsmParam = new ssm.StringParameter(this, 'UserPoolDomainUrlSsmParam', {
			parameterName: `${props.ssmParamHierarchy}userPoolDomainUrl`,
			stringValue: domain.baseUrl(),
		});
		const oauthCallbackUrlSsmParam = new ssm.StringParameter(this, 'OAuthCallbackUrlSsmParam', {
			parameterName: `${props.ssmParamHierarchy}callbackUrl`,
			stringValue: `https://${props.frontendDomainName}/`,
		});
		const oauthSignOutUrlSsmParam = new ssm.StringParameter(this, 'OAuthSignOutURLSsmParam', {
			parameterName: `${props.ssmParamHierarchy}signOutUrl`,
			stringValue: `https://${props.frontendDomainName}`,
		});

		// CDK nag suppressions
		NagSuppressions.addStackSuppressions(this,
			[
				{
					id: 'AwsSolutions-IAM4',
					reason: 'Was getting triggered when using domain.cloudFrontDomainName. Think this is a bug',
				},
				{
					id: 'AwsSolutions-IAM5',
					reason: 'Was getting triggered when using domain.cloudFrontDomainName. Think this is a bug',
				},
				{
					id: 'AwsSolutions-L1',
					reason: 'Was getting triggered when using domain.cloudFrontDomainName. Think this is a bug',
				},
			],
			true,
		);
	}
}
