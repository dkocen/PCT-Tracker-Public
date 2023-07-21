/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/naming-convention */
/*
This CDK stack creates a static website and CDN using a serverless architecture.

The website code is stored in a private S3 bucket.

A CloudFront distribution is used as a content distribution network and given
sole access to read from the S3 bucket using Origin Access Control.

HTTPS encryption is implemented using Amazon Certificate Manager and a custom
domain name is associated with the CloudFront distribution using Route53.

Prerequisites:
 - Existing hosted zone associated with custom domain name
 - Existing ACM DNS certificate for domain
*/

import {Stack, type StackProps, RemovalPolicy, CfnOutput} from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import {type Construct} from 'constructs';
import {loadSSMParams} from './infrastructure/ssm-params-util';

export type FrontendInfrastructureStackProps = {
	frontendBuildPath: string;
	cdkAppName: string;
	ssmParamsHierarchy: string;
} & StackProps;

export class FrontendInfrastructureStack extends Stack {
	constructor(scope: Construct, id: string, props: FrontendInfrastructureStackProps) {
		super(scope, id, props);

		const ssmParams = loadSSMParams(this);
		const domainName = ssmParams.frontendDomainName as string;
		const hostedZoneId = ssmParams.hostedZoneId as string;
		const certificateArn = ssmParams.acmCertificateArn as string;

		// Fetch already created hosted zone and DNS certs (prerequisite)
		// Hosted zone must be made in advance because it is connected to a
		// custome domain. DNS cert is made in advance more to save time when deploying
		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
			hostedZoneId,
			zoneName: domainName,
		});
		const dnsCert = acm.Certificate.fromCertificateArn(this, 'domainCert', certificateArn);

		// Create S3 bucket for hosting assets
		const webAppBucket = new s3.Bucket(this, 'WebAppBucket', {
			publicReadAccess: false,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			encryption: s3.BucketEncryption.S3_MANAGED,
			serverAccessLogsPrefix: 'serverAccessLogs/',
			enforceSSL: true,
		});

		// Create S3 bucket for CloudFront logs
		const cloudfrontLogBucket = new s3.Bucket(this, 'LogBucket', {
			publicReadAccess: false,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			encryption: s3.BucketEncryption.S3_MANAGED,
			serverAccessLogsPrefix: `${props.cdkAppName}-CloudFrontLogBucketServerAccessLogs`,
			enforceSSL: true,
		});

		// Create CloudFront Distribution following good security practices
		// and cheapest price class
		const cloudfrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontDistribution', {
			originConfigs: [
				{
					s3OriginSource: {
						s3BucketSource: webAppBucket,
					},
					behaviors: [{
						isDefaultBehavior: true,
						compress: true,
					}],
				},
			],
			viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(dnsCert, {
				aliases: [domainName],
				securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
				sslMethod: cloudfront.SSLMethod.SNI,
			}),
			defaultRootObject: 'index.html',
			loggingConfig: {
				bucket: cloudfrontLogBucket,
			},
			viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
			geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'GB', 'IE', 'AU'),
			comment: 'Created with CDK',
			errorConfigurations: [
				{
					errorCode: 403,
					responseCode: 200,
					responsePagePath: '/index.html',
				},
			],
		});

		// Route53 alias record for the CloudFront distribution
		const route53AliasRecord = new route53.ARecord(this, 'SiteAliasRecord', {
			recordName: domainName,
			target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudfrontDistribution)),
			zone: hostedZone,
		});

		// Create Origin Access Control Resource
		const oac = new cloudfront.CfnOriginAccessControl(this, 'WebBucketOAC', {
			originAccessControlConfig: {
				name: 'WebBucketOAC',
				originAccessControlOriginType: 's3',
				signingBehavior: 'always',
				signingProtocol: 'sigv4',
			},
		});

		// Define and apply IAM policys for OAC to WebAppBucket
		const allowOriginAccessControlPolicy = new iam.PolicyStatement({
			actions: ['s3:GetObject'],
			principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
			effect: iam.Effect.ALLOW,
			resources: [webAppBucket.arnForObjects('*')],
			conditions: {
				StringEquals: {
					'AWS:SourceArn': `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${cloudfrontDistribution.distributionId}`,
				},
			},
		});
		webAppBucket.addToResourcePolicy(allowOriginAccessControlPolicy);

		// Attach OAC ID to cloudFrontDistribution
		const cfnDistributionNode = cloudfrontDistribution.node.defaultChild as cloudfront.CfnDistribution;
		cfnDistributionNode.addPropertyOverride(
			'DistributionConfig.Origins.0.OriginAccessControlId',
			oac.getAtt('Id'),
		);

		const webAppBucketSSMParam = new ssm.StringParameter(this, 'WebAppBucketSSMParam', {
			parameterName: `${props.ssmParamsHierarchy}webAppBucket`,
			stringValue: webAppBucket.bucketName,
		});

		const cloudfrontDistSSMParam = new ssm.StringParameter(this, 'CloudfrontDistSSMParam', {
			parameterName: `${props.ssmParamsHierarchy}cloudfrontDist`,
			stringValue: cloudfrontDistribution.distributionId,
		});

		// CDK Outputs
		new CfnOutput(this, 'Site', {value: 'https://' + domainName});
		new CfnOutput(this, 'WebAppBucketName', {value: webAppBucket.bucketName});
		new CfnOutput(this, 'CloudfrontLogBucketName', {value: cloudfrontLogBucket.bucketName});
		new CfnOutput(this, 'CloudfrontDistribution', {value: cloudfrontDistribution.distributionId});
	}
}

