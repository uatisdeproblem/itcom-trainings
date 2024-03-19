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
}
