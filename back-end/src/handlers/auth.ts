///
/// IMPORTS
///

import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SystemsManager } from 'idea-aws';

import { User } from '../models/user.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const PROJECT = process.env.PROJECT;
const PARAMETERS_PATH = `/${PROJECT}/auth`;
const ssm = new SystemsManager();

let JWT_SECRET: string;

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<HTTPAuthResult>): Promise<any> => {
  const authorization = event?.headers?.authorization;
  const result: HTTPAuthResult = { isAuthorized: false };
  const user = await verifyTokenAndGetESNAccountsUser(authorization);

  if (user) {
    result.context = { principalId: user.userId, user };
    result.isAuthorized = true;
  }

  return result;
};

//
// HELPERS
//

const getJwtSecretFromSystemsManager = async (): Promise<string> => {
  if (!JWT_SECRET) JWT_SECRET = await ssm.getSecretByName(PARAMETERS_PATH);
  return JWT_SECRET;
};
const verifyTokenAndGetESNAccountsUser = async (token: string): Promise<User> => {
  const secret = await getJwtSecretFromSystemsManager();
  try {
    const result = verify(token, secret) as JwtPayload;
    return new User(result);
  } catch (error) {
    return null;
  }
};

//
// INTERFACES
//

/**
 * Expected result by a Lambda authorizer (payload format: 2.0).
 */
interface HTTPAuthResult {
  isAuthorized: boolean;
  context?: { principalId: string; user: User };
}
