#!/bin/bash

# project specific parameters
STAGE=$1
AWS_PROFILE='itcom-trainings'
DOMAIN_PROD='itcom-trainings.link'
DOMAIN_DEV="${STAGE}.${DOMAIN_PROD}"

# other parameters
SRC_FOLDER="${PWD}/src"
BACK_END_FOLDER="back-end"
SWAGGER_FILE="swagger.yaml"
C='\033[4;32m' # color
NC='\033[0m'   # reset (no color)

# disable pagination in aws cli commands
export AWS_PAGER=""

# set the script to exit in case of errors
set -o errexit

if [ "${STAGE}" == 'prod' ]
then
  DOMAIN=${DOMAIN_PROD}
else
  DOMAIN=${DOMAIN_DEV}
fi
echo -e "${C}Target domain: ${DOMAIN}${NC}"

# install the npm modules
echo -e "${C}Installing npm modules...${NC}"
npm i --silent 1>/dev/null

# lint the code in search for errors
echo -e "${C}Linting...${NC}"
npm run lint ${SRC_FOLDER} 1>/dev/null

# compile the project's typescript code
echo -e "${C}Compiling...${NC}"
ionic build --prod 1>/dev/null

# get the target CloudFront distribution and S3 bucket (from the domain)
DISTRIBUTION=`aws cloudfront list-distributions --query "DistributionList.Items[*].{Id: Id, Aliases: Aliases.Items[?(@ == '${DOMAIN}')]} | [?Aliases].[Id]" --profile ${AWS_PROFILE} --output text`
BUCKET=`aws cloudfront get-distribution --id ${DISTRIBUTION} --profile ${AWS_PROFILE} --output text \
 --query "Distribution.DistributionConfig.Origins.Items[0].DomainName" | cut -d "." -f 1`

# upload the project's files to the S3 bucket
echo -e "${C}Uploading...${NC}"
aws s3 sync ./www s3://${BUCKET} --profile ${AWS_PROFILE} --delete --exclude ".well-known/*" 1>/dev/null

# add the Swagger (OpenApi 3.0) file
# echo -e "${C}Adding API docs...${NC}"
# aws s3 cp ../${BACK_END_FOLDER}/${SWAGGER_FILE} s3://${BUCKET}/${SWAGGER_FILE} --profile ${AWS_PROFILE} 1>/dev/null

# invalidate old common files from the CloudFront distribution
echo -e "${C}Cleaning...${NC}"
aws cloudfront create-invalidation --profile ${AWS_PROFILE} --distribution-id ${DISTRIBUTION} \
  --paths "/index.html" "/assets/i18n*" "/${SWAGGER_FILE}" \
  1>/dev/null

echo -e "${C}Done!${NC}"