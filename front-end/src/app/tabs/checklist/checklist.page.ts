import { Component, inject } from '@angular/core';

import { APP_CHECKLIST, ChecklistUser } from '@models/checklistUser.model';
import { ChecklistService } from './checklist.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'checklist',
  templateUrl: 'checklist.page.html',
  styleUrls: ['checklist.page.scss']
})
export class ChecklistPage {
  list = APP_CHECKLIST;
  checkElements: ChecklistUser[] = [];

  _checklist = inject(ChecklistService);
  _app = inject(AppService);

  async ionViewDidEnter(): Promise<void> {
    this.checkElements = await this._checklist.getList();
  }

  async checkOrUncheck(checkName: string): Promise<void> {
    const check = new ChecklistUser({ userId: this._app.user.userId, checkName });
    if (this.isChecked(checkName)) {
      await this._checklist.markUnchecked(check);
    } else {
      await this._checklist.markChecked(check);
    }
  }

  isChecked(checkName: string): boolean {
    return this.checkElements.some(x => x.checkName === checkName);
  }
}
