import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IDEALoadingService, IDEAMessageService } from '@idea-ionic/common';

import { CommunicationDetailComponent } from './communicationDetail.component';
import { ManageCommunicationComponent } from './manageCommunication.component';

import { CommunicationsService } from './communications.service';

import { Communication } from '@models/communication.model';

@Component({
  selector: 'communications',
  templateUrl: 'communications.page.html',
  styleUrls: ['communications.page.scss']
})
export class CommunicationsPage {
  _communications = inject(CommunicationsService);
  _loading = inject(IDEALoadingService);
  _message = inject(IDEAMessageService);
  _modal = inject(ModalController);

  communications: Communication[];

  async ionViewDidEnter(): Promise<void> {
    try {
      await this._loading.show();
      this.communications = await this._communications.getList({ force: true });
    } catch (error) {
      this._message.error('Error loading the list', true);
    } finally {
      this._loading.hide();
    }
  }

  async openCommunication(communication: Communication): Promise<void> {
    const modal = await this._modal.create({
      component: CommunicationDetailComponent,
      componentProps: { communication }
    });
    modal.present();
  }

  async manageCommunication(communication: Communication): Promise<void> {
    const modal = await this._modal.create({
      component: ManageCommunicationComponent,
      componentProps: { communication },
      backdropDismiss: false
    });
    modal.onDidDismiss().then(async (): Promise<void> => {
      this.communications = await this._communications.getList({ force: true });
    });
    await modal.present();
  }

  async addCommunication(): Promise<void> {
    await this.manageCommunication(new Communication());
  }
}
