import { Injectable, inject } from '@angular/core';
import { IDEAApiService } from '@idea-ionic/common';

import { ChecklistUser } from '@models/checklistUser.model';

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  _api = inject(IDEAApiService);

  async getList(): Promise<ChecklistUser[]> {
    return await this._api.getResource('checklist');
  }

  async markChecked(checkElement: ChecklistUser): Promise<void> {
    await this._api.postResource('checklist', { body: checkElement });
  }

  async markUnchecked(checkElement: ChecklistUser): Promise<void> {
    const params = { checkName: checkElement.checkName };
    await this._api.deleteResource('checklist', { params });
  }
}
