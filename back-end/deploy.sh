#!/bin/bash

# project-specific parameters
PROJECT='itcom-trainings'
AWS_PROFILE='itcom-trainings'

# other parameters
STAGE=$1
QUICK=$2
SRC_FOLDER='src/'
C='\033[4;32m' # color
NC='\033[0m'   # reset (no color)

# disable pagination in aws cli commands
export AWS_PAGER=""

# set the script to exit in case of errors
set -o errexit

# run the deploy-quick script with AWS CDK and exit
if [ "${QUICK}" != "" ]
then
  npm run compile && npm run deploy "${PROJECT}-${STAGE}-api" \
    -- --context "stage=${STAGE}" --exclusively --hotswap --profile ${AWS_PROFILE}
  exit 0
fi

# install the npm modules
echo -e "${C}Installing npm modules...${NC}"
npm i --silent 1>/dev/null

# lint the code in search for errors
echo -e "${C}Linting...${NC}"
npm run lint ${SRC_FOLDER} 1>/dev/null

# compiling models
echo -e "${C}Compiling...${NC}"
npm run compile 1>/dev/null

# build and deploy with AWS CDK
echo -e "${C}Deploying CDK stacks...${NC}"
npm run deploy -- --context stage=${STAGE} --all --require-approval never --profile ${AWS_PROFILE}