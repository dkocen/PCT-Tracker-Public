import {NestedStack, type NestedStackProps, CfnOutput, RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {type Construct} from 'constructs';

export type DynamodbStackProps = {
	readonly cdkAppName: string;
} & NestedStackProps;

export class DynamodbStack extends NestedStack {
	public readonly table: dynamodb.ITable;

	constructor(scope: Construct, id: string, props: DynamodbStackProps) {
		super(scope, id, props);

		// Create DynamoDB Table
		const table = new dynamodb.Table(this, `${props.cdkAppName}-MessagesTable`, {
			partitionKey: {name: 'sentBy', type: dynamodb.AttributeType.STRING},
			sortKey: {name: 'sentOn', type: dynamodb.AttributeType.STRING},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			encryption: dynamodb.TableEncryption.AWS_MANAGED,
			removalPolicy: RemovalPolicy.RETAIN,
		});

		this.table = table;

		new CfnOutput(this, 'MessagesDynamoDBTable', {value: table.tableArn});
	}
}
