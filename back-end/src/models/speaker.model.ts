import { Resource } from 'idea-toolbox';

/**
 * A speaker from the event.
 */
export class Speaker extends Resource {
  /**
   * The ID of the speaker.
   */
  speakerId: string;
  /**
   * The name of the speaker.
   */
  name: string;
  /**
   * The URL to the speaker's image (if any).
   */
  imageURL: string | null;

  load(x: any): void {
    super.load(x);
    this.speakerId = this.clean(x.speakerId, String);
    this.name = this.clean(x.name, String);
    this.imageURL = this.clean(x.imageURL, String);
  }

  safeLoad(newData: any, safeData: any): void {
    super.safeLoad(newData, safeData);
    this.speakerId = safeData.speakerId;
  }

  validate(): string[] {
    const e = super.validate();
    if (this.iE(this.name)) e.push('name');
    return e;
  }
}
