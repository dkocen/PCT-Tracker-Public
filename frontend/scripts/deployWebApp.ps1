# Fetch parameter names

$webAppBucket = aws ssm get-parameter --region us-west-2 --name "/PCTTracker/webAppBucket"  --query Parameter.Value --output text
$cloudFrontDist = aws ssm get-parameter --region us-west-2 --name "/PCTTracker/cloudfrontDist" --query Parameter.Value --output text

# Sync the web app bucket with the current build
echo "Syncing to S3 bucket $webAppBucket"
aws s3 sync ../frontend/build s3://$webAppBucket/

# Invalidate Cloudfront to clear cache
echo "Invalidating Cloudfront distribution ID $cloudfrontDist"
aws cloudfront create-invalidation --distribution $cloudfrontDist --paths "/*"