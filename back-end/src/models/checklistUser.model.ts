import { Resource } from 'idea-toolbox';

export const APP_CHECKLIST = ['Pyjama', 'Shoes', 'Badge', 'Tshirt'];

/**
 * Checklist for a specific user.
 */
export class ChecklistUser extends Resource {
  /**
   * The ID of the user. (PK)
   */
  userId: string;
  /**
   * The name of the check in the list that the user achieved. (SK)
   */
  checkName: string;

  load(x: any): void {
    super.load(x);
    this.userId = this.clean(x.userId, String);
    this.checkName = this.clean(x.checkName, String);
  }

  safeLoad(newData: any, safeData: any): void {
    super.safeLoad(newData, safeData);
    this.userId = safeData.userId;
    this.checkName = safeData.checkName;
  }

  validate(): string[] {
    const e = super.validate();
    if (this.iE(this.userId)) e.push('userId');
    if (this.iE(this.checkName)) e.push('checkName');
    return e;
  }
}
