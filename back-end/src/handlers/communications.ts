///
/// IMPORTS
///

import { DynamoDB, HandledError, ResourceController } from 'idea-aws';

import { Communication } from '../models/communication.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const PROJECT = process.env.PROJECT;
const DDB_TABLES = { communications: process.env.DDB_TABLE_communications };
const ddb = new DynamoDB();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new CommunicationsRC(ev, cb).handleRequest();

///
/// RESOURCE CONTROLLER
///

class CommunicationsRC extends ResourceController {
  communication: Communication;

  constructor(event: any, callback: any) {
    super(event, callback, { resourceId: 'communicationId' });
  }

  protected async checkAuthBeforeRequest(): Promise<void> {
    if (!this.resourceId) return;

    try {
      this.communication = new Communication(
        await ddb.get({ TableName: DDB_TABLES.communications, Key: { communicationId: this.resourceId } })
      );
    } catch (err) {
      throw new HandledError('Communication not found');
    }
  }

  protected async getResources(): Promise<Communication[]> {
    let communications: Communication[] = await ddb.scan({ TableName: DDB_TABLES.communications });
    communications = communications.map(x => new Communication(x));

    if (this.queryParams.year)
      communications = communications.filter(x => new Date(x.date).getFullYear().toString() === this.queryParams.year);
    else communications = communications.filter(x => !x.isArchived());

    communications = communications.sort((a, b): number => b.date.localeCompare(a.date));

    return communications;
  }

  private async putSafeResource(opts: { noOverwrite: boolean }): Promise<Communication> {
    const errors = this.communication.validate();
    if (errors.length) throw new HandledError(`Invalid fields: ${errors.join(', ')}`);

    const putParams: any = { TableName: DDB_TABLES.communications, Item: this.communication };
    if (opts.noOverwrite) putParams.ConditionExpression = 'attribute_not_exists(communicationId)';
    await ddb.put(putParams);

    return this.communication;
  }

  protected async postResources(): Promise<Communication> {
    this.communication = new Communication(this.body);
    this.communication.communicationId = await ddb.IUNID(PROJECT);
    return await this.putSafeResource({ noOverwrite: true });
  }

  protected async getResource(): Promise<Communication> {
    return this.communication;
  }

  protected async putResource(): Promise<Communication> {
    const oldCommunication = new Communication(this.communication);
    this.communication.safeLoad(this.body, oldCommunication);
    return await this.putSafeResource({ noOverwrite: false });
  }

  protected async deleteResource(): Promise<void> {
    await ddb.delete({
      TableName: DDB_TABLES.communications,
      Key: { communicationId: this.communication.communicationId }
    });
  }
}
