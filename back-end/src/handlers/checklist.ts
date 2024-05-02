///
/// IMPORTS
///

import { DynamoDB, HandledError, ResourceController } from 'idea-aws';

import { User } from '../models/user.model';
import { ChecklistUser } from '../models/checklistUser.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const DDB_TABLES = { checklistUsers: process.env.DDB_TABLE_checklistUsers };
const ddb = new DynamoDB();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new ChecklistUsersRC(ev, cb).handleRequest();

///
/// RESOURCE CONTROLLER
///

class ChecklistUsersRC extends ResourceController {
  galaxyUser: User;

  constructor(event: any, callback: any) {
    super(event, callback);
    this.galaxyUser = new User(event.requestContext.authorizer.lambda.user);
  }

  protected async checkAuthBeforeRequest(): Promise<void> {
    // we don't need it
  }

  protected async getResources(): Promise<ChecklistUser[]> {
    // GET /checklist

    const checklistUser = (
      await ddb.query({
        TableName: DDB_TABLES.checklistUsers,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': this.galaxyUser.userId }
      })
    ).map(x => new ChecklistUser(x));

    return checklistUser;
  }

  protected async postResources(): Promise<void> {
    // POST /checklist

    const checklist = new ChecklistUser(this.body);

    const errors = checklist.validate();
    if (errors.length > 0) throw new HandledError('Invalid fields: '.concat(errors.join(', ')));

    await ddb.put({ TableName: DDB_TABLES.checklistUsers, Item: checklist });
  }

  protected async deleteResources(): Promise<void> {
    // DELETE /checklist

    await ddb.delete({
      TableName: DDB_TABLES.checklistUsers,
      Key: { userId: this.galaxyUser.userId, checkName: this.queryParams.checkName }
    });
  }
}
