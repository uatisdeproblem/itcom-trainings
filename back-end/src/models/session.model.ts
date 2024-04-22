import { epochISOString, Resource } from 'idea-toolbox';

/**
 * A training session.
 */
export class Session extends Resource {
  /**
   * The ID of the session.
   */
  sessionId: string;
  /**
   * The title of the session.
   */
  name: string;
  /**
   * A catchy subtitle for the session (brief description).
   */
  brief: string;
  /**
   * The full-length description of the session.
   */
  content: string;
  /**
   * The date (and time) when the session starts.
   */
  startsAt: epochISOString;
  /**
   * The date (and time) when the session ends.
   */
  endsAt: epochISOString;
  /**
   * The name of the room where the session will be held.
   */
  room: string;
  /**
   * The name of the speakers that will hold the session.
   */
  speakers: string[];
  /**
   * The IDs of the users registered to the session.
   */
  participants: string[];
  /**
   * The number of maximum participants that can register to the session.
   * If set to `0`, the session doesn't have a maximum number of participants.
   */
  numMaxParticipants: number;

  load(x: any): void {
    super.load(x);
    this.sessionId = this.clean(x.sessionId, String);
    this.name = this.clean(x.name, String);
    this.brief = this.clean(x.brief, String);
    this.content = this.clean(x.content, String);
    this.startsAt = this.clean(x.startsAt, d => new Date(d).toISOString());
    this.endsAt = this.clean(x.endsAt, d => new Date(d).toISOString());
    this.room = this.clean(x.room, String);
    this.speakers = this.cleanArray(x.speakers, String);
    this.participants = this.cleanArray(x.participants, String);
    this.numMaxParticipants = this.clean(x.numMaxParticipants, Number, 0);
  }

  safeLoad(newData: any, safeData: any): void {
    super.safeLoad(newData, safeData);
    this.sessionId = safeData.sessionId;
    this.participants = safeData.participants;
    this.numMaxParticipants = safeData.numMaxParticipants;
  }

  validate(): string[] {
    const e = super.validate();
    if (this.iE(this.name)) e.push('name');
    if (this.iE(this.brief)) e.push('brief');
    if (this.iE(this.startsAt, 'date')) e.push('startsAt');
    if (this.iE(this.endsAt, 'date') || this.startsAt > this.endsAt) e.push('endsAt');
    return e;
  }
}
