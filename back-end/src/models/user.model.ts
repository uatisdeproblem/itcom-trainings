import { Resource } from 'idea-toolbox';

export class User extends Resource {
  /**
   * Username in ESN Accounts (lowercase).
   */
  userId: string;
  /**
   * Email address.
   */
  email: string;
  /**
   * First name.
   */
  firstName: string;
  /**
   * Last name.
   */
  lastName: string;
  /**
   * Section code in ESN Accounts.
   */
  roles: string[];
  /**
   * Section code in ESN Accounts.
   */
  sectionCode: string;
  /**
   * ESN Section.
   */
  section: string;
  /**
   * ESN Country.
   */
  country: string;
  /**
   * The URL to the user's avatar.
   */
  avatarURL: string;

  load(x: any): void {
    super.load(x);
    this.userId = this.clean(x.userId, String)?.toLowerCase();
    this.email = this.clean(x.email, String);
    this.firstName = this.clean(x.firstName, String);
    this.lastName = this.clean(x.lastName, String);
    this.roles = this.cleanArray(x.roles, String);
    this.sectionCode = this.clean(x.sectionCode, String);
    this.section = this.clean(x.section, String);
    this.country = this.clean(x.country, String);
    this.avatarURL = this.clean(x.avatarURL, String);
  }

  /**
   * Get a string representing the origin of the user.
   */
  getOrigin(): string {
    if (this.country === this.section) return this.section;
    return [this.country, this.section].filter(x => x).join(' - ');
  }
}
