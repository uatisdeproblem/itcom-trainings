import { DynamoDB, HandledError, ResourceController } from 'idea-aws';

import { User } from '../models/user.model';
import { Speaker } from '../models/speaker.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const PROJECT = process.env.PROJECT;
const DDB_TABLES = { speakers: process.env.DDB_TABLE_speakers };
const ddb = new DynamoDB();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new SpeakerRC(ev, cb).handleRequest();

class SpeakerRC extends ResourceController {
  galaxyUser: User;
  speaker: Speaker;

  constructor(event: any, callback: any) {
    super(event, callback, { resourceId: 'speakerId' });
    this.galaxyUser = new User(event.requestContext.authorizer.lambda.user);
  }

  protected async checkAuthBeforeRequest(): Promise<void> {
    if (!this.resourceId) return;

    try {
      this.speaker = new Speaker(
        await ddb.get({ TableName: DDB_TABLES.speakers, Key: { speakerId: this.resourceId } })
      );
    } catch (err) {
      throw new HandledError('Communication not found');
    }
  }

  protected async getResources(): Promise<Speaker[]> {
    let speakers: Speaker[] = await ddb.scan({ TableName: DDB_TABLES.speakers });
    speakers = speakers.map(x => new Speaker(x));

    return speakers;
  }

  private async putSafeResource(opts: { noOverwrite: boolean }): Promise<Speaker> {
    const errors = this.speaker.validate();
    if (errors.length) throw new HandledError(`Invalid fields: ${errors.join(', ')}`);

    const putParams: any = { TableName: DDB_TABLES.speakers, Item: this.speaker };
    if (opts.noOverwrite) putParams.ConditionExpression = 'attribute_not_exists(speakerId)';
    await ddb.put(putParams);

    return this.speaker;
  }

  protected async postResources(): Promise<Speaker> {
    this.speaker = new Speaker(this.body);
    this.speaker.speakerId = await ddb.IUNID(PROJECT);
    return await this.putSafeResource({ noOverwrite: true });
  }

  protected async getResource(): Promise<Speaker> {
    return this.speaker;
  }

  protected async putResource(): Promise<Speaker> {
    const oldSpeaker = new Speaker(this.speaker);
    this.speaker.safeLoad(this.body, oldSpeaker);
    return await this.putSafeResource({ noOverwrite: false });
  }

  protected async deleteResource(): Promise<void> {
    await ddb.delete({
      TableName: DDB_TABLES.speakers,
      Key: { speakerId: this.speaker.speakerId }
    });
  }
}
