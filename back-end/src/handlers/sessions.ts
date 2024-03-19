///
/// IMPORTS
///

import { DynamoDB, HandledError, ResourceController } from 'idea-aws';

import { User } from '../models/user.model';
import { Session } from '../models/session.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const PROJECT = process.env.PROJECT;
const DDB_TABLES = { sessions: process.env.DDB_TABLE_sessions };
const ddb = new DynamoDB();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new SessionsRC(ev, cb).handleRequest();

///
/// RESOURCE CONTROLLER
///

class SessionsRC extends ResourceController {
  galaxyUser: User;
  session: Session;

  constructor(event: any, callback: any) {
    super(event, callback, { resourceId: 'sessionId' });
    this.galaxyUser = new User(event.requestContext.authorizer.lambda.user);
  }

  protected async checkAuthBeforeRequest(): Promise<void> {
    if (!this.resourceId) return;

    try {
      this.session = new Session(
        await ddb.get({ TableName: DDB_TABLES.sessions, Key: { sessionId: this.resourceId } })
      );
    } catch (err) {
      throw new HandledError('Session not found');
    }
  }

  protected async getResources(): Promise<Session[]> {
    let sessions: Session[] = await ddb.scan({ TableName: DDB_TABLES.sessions });
    sessions = sessions.map(x => new Session(x));

    sessions = sessions.sort((a, b): number => a.startsAt.localeCompare(b.startsAt));

    return sessions;
  }

  private async putSafeResource(opts: { noOverwrite: boolean }): Promise<Session> {
    const errors = this.session.validate();
    if (errors.length) throw new HandledError(`Invalid fields: ${errors.join(', ')}`);

    const putParams: any = { TableName: DDB_TABLES.sessions, Item: this.session };
    if (opts.noOverwrite) putParams.ConditionExpression = 'attribute_not_exists(sessionId)';
    await ddb.put(putParams);

    return this.session;
  }

  protected async postResources(): Promise<Session> {
    this.session = new Session(this.body);
    this.session.sessionId = await ddb.IUNID(PROJECT);
    return await this.putSafeResource({ noOverwrite: true });
  }

  protected async getResource(): Promise<Session> {
    return this.session;
  }

  protected async putResource(): Promise<Session> {
    const oldSession = new Session(this.session);
    this.session.safeLoad(this.body, oldSession);
    return await this.putSafeResource({ noOverwrite: false });
  }

  protected async patchResource(): Promise<Session> {
    switch (this.body.action) {
      case 'REGISTER':
        return await this.register();
      case 'CANCEL_REGISTRATION':
        return await this.cancelRegistration();
      default:
        throw new HandledError('Unsupported action');
    }
  }
  private async register(): Promise<Session> {
    if (this.session.participants.includes(this.galaxyUser.userId)) return this.session;
    if (this.session.participants.length >= this.session.numMaxParticipants) throw new HandledError('Session is full');

    this.session.participants.push(this.galaxyUser.userId);

    await ddb.update({
      TableName: DDB_TABLES.sessions,
      Key: { sessionId: this.session.sessionId },
      UpdateExpression: 'SET participants = :participants',
      ExpressionAttributeValues: { ':participants': this.session.participants }
    });

    return this.session;
  }
  private async cancelRegistration(): Promise<Session> {
    const index = this.session.participants.indexOf(this.galaxyUser.userId);
    if (index === -1) return this.session;

    this.session.participants.splice(index, 1);

    await ddb.update({
      TableName: DDB_TABLES.sessions,
      Key: { sessionId: this.session.sessionId },
      UpdateExpression: 'SET participants = :participants',
      ExpressionAttributeValues: { ':participants': this.session.participants }
    });

    return this.session;
  }

  protected async deleteResource(): Promise<void> {
    await ddb.delete({
      TableName: DDB_TABLES.sessions,
      Key: { sessionId: this.session.sessionId }
    });
  }
}
