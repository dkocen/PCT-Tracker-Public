# Set the AWS region and parameter names
$region = "us-west-2"
$paramNames = "/PCTTracker/mapsApiKey", "/PCTTracker/photoAlbumId", "/PCTTracker/frontendApiEndpoint", "/PCTTracker/cognitoRegion", "/PCTTracker/userPoolId", "/PCTTracker/userPoolClientId", "/PCTTracker/userPoolDomainUrl", "/PCTTracker/callbackUrl", "/PCTTracker/signOutUrl"

# Retrieve the parameters and store the output in a variable
$paramsOutput = aws ssm get-parameters `
  --region $region `
  --names $paramNames `
  --query "Parameters[*].{Name:Name,Value:Value}" `
  --output json

# Convert the JSON output to a PowerShell object
$params = $paramsOutput | ConvertFrom-Json 

echo $params

# Create a hashtable to store the parameter values
$paramValues = @{}
foreach ($param in $params) {
  $paramKey = $param.Name.Split('/')[2]
  $paramValues[$paramKey] = $param.Value
}

# Convert the parameter values to JSON and save to a file
$configParams = $paramValues | ConvertTo-Json 
              
$configParams | Out-File "./src/configParams.json" -Encoding utf8

# Print a message indicating the file was saved
Write-Host "Parameter values saved to configParams.json"