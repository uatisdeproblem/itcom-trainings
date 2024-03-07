import { Component, inject } from '@angular/core';

import { CommunicationsService } from './communications.service';

@Component({
  selector: 'communications',
  templateUrl: 'communications.page.html',
  styleUrls: ['communications.page.scss']
})
export class CommunicationsPage {
  _communications = inject(CommunicationsService);

  async ionViewDidEnter(): Promise<void> {
    // todo
  }
}
