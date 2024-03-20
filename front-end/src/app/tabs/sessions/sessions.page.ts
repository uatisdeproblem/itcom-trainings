import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IDEALoadingService, IDEAMessageService } from '@idea-ionic/common';

import { SessionsService } from './sessions.service';
import { Session } from '@models/session.model';

@Component({
  selector: 'sessions',
  templateUrl: 'sessions.page.html',
  styleUrls: ['sessions.page.scss']
})
export class SessionsPage {
  _sessions = inject(SessionsService);
  _loading = inject(IDEALoadingService);
  _message = inject(IDEAMessageService);
  _modal = inject(ModalController);

  sessions: Session[];

  async ionViewDidEnter(): Promise<void> {
    try {
      await this._loading.show();
      this.sessions = await this._sessions.getList({ force: true });
      this.sessions[0].speakers = ["John", "Mary"];
      for (const session of this.sessions) {
        console.log(session);
      }
    } catch (error) {
      this._message.error('Error loading the list', true);
    } finally {
      this._loading.hide();
    }
  }

}
