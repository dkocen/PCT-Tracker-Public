# CDK Stacks for PCT Tracker website

This folder contains all the necessary files to deploy the AWS infrastructure of the PCT Tracker using the AWS Cloud Development Kit.

The stack is split into two main substacks: backend-infrastructure and frontend-infrastructure.

## Backend Infrastructure
The backend infrastructure stack creates:
1. A DynamoDB table for storing web and GPS messages.
1. The API for interacting with Garmin InReach Portal Connect and relevant Lambda functions.
1. The API for interacting with the website frontend and relevant Lambda functions.
1. The infrastructure for handling user login with Amazon Cognito and Google accounts.

Each of these components is itself a substack of the backend infrastructure substack and can be found in the infrastructure or api subfolders.

## Frontend Infrastructure
The frontend infrastructure stack creates:
1. An S3 bucket to host static files.
1. An S3 bucket to host website logs.
1. A CloudFront distribution for serving the website.
1. Relevant connections with pre-existing domain name and domain certificates.

This stack relies on the user already having a Route53 hosted zone and ACM domain certificate. The values for these pre-existing resources are defined during deployment