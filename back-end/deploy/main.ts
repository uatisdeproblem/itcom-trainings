#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as DDB from 'aws-cdk-lib/aws-dynamodb';

import { IDEAStack } from './idea-stack';
import { MediaStack } from './media-stack';
import { ApiDomainStack } from './api-domain-stack';
import { ResourceController, ApiStack, DDBTable } from './api-stack';
import { FrontEndStack } from './front-end-stack';

import { parameters, stages, Stage } from './environments';

//
// RESOURCES
//

const apiResources: ResourceController[] = [
  { name: 'auth', isAuthFunction: true },
  { name: 'login', paths: ['/login'] },
  { name: 'media', paths: ['/media'] },
  { name: 'communications', paths: ['/communications', '/communications/{communicationId}'] },
  { name: 'checklist', paths: ['/checklist'] },
  { name: 'sessions', paths: ['/sessions', '/sessions/{sessionId}'] },
  { name: 'speakers', paths: ['/speakers', '/speakers/{speakerId}'] },
];

const tables: { [tableName: string]: DDBTable } = {
  communications: {
    PK: { name: 'communicationId', type: DDB.AttributeType.STRING }
  },
  sessions: {
    PK: { name: 'sessionId', type: DDB.AttributeType.STRING }
  },
  checklistUsers: {
    PK: { name: 'userId', type: DDB.AttributeType.STRING },
    SK: { name: 'checkName', type: DDB.AttributeType.STRING }
  },
  speakers: {
    PK: {name: 'speakerId', type: DDB.AttributeType.STRING}
  },
};

//
// STACKS
//

const createApp = async (): Promise<void> => {
  const app = new cdk.App({});

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

  const STAGE = app.node.tryGetContext('stage');
  const STAGE_VARIABLES = (stages as any)[STAGE] as Stage;
  if (!STAGE_VARIABLES) {
    console.log('Missing stage (environments.ts); e.g. --parameters stage=dev\n\n');
    throw new Error();
  }

  //
  // GENERIC RESOURCES (they don't depend by the stage)
  //

  new IDEAStack(app, `idea-resources`);

  const mediaStack = new MediaStack(app, `${parameters.project}-media`, {
    env,
    mediaBucketName: `idea-${parameters.project}-media`,
    mediaDomain: parameters.mediaDomain
  });

  const apiDomainStack = new ApiDomainStack(app, `${parameters.project}-api-domain`, {
    env,
    domain: parameters.apiDomain
  });

  //
  // STAGE-DEPENDANT RESOURCES
  //

  const apiStack = new ApiStack(app, `${parameters.project}-${STAGE}-api`, {
    env,
    project: parameters.project,
    stage: STAGE,
    firstAdminEmail: parameters.firstAdminEmail,
    apiDomain: parameters.apiDomain,
    apiDefinitionFile: './swagger.yaml',
    resourceControllers: apiResources,
    tables,
    mediaBucketArn: mediaStack.mediaBucketArn,
    lambdaLogLevel: STAGE_VARIABLES.logLevel ?? 'INFO',
    appDomain: STAGE_VARIABLES.domain,
    removalPolicy: STAGE_VARIABLES.destroyDataOnDelete ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN
  });
  apiStack.addDependency(mediaStack);
  apiStack.addDependency(apiDomainStack);

  new FrontEndStack(app, `${parameters.project}-${STAGE}-front-end`, {
    env,
    project: parameters.project,
    stage: STAGE,
    domain: STAGE_VARIABLES.domain
  });
};
createApp();
