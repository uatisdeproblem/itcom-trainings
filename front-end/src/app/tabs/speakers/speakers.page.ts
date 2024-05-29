import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IDEALoadingService, IDEAMessageService } from '@idea-ionic/common';

import { Speaker } from '@models/speaker.model';
import { SpeakerService } from './speakers.service';

@Component({
  selector: 'speakers',
  templateUrl: 'speakers.page.html',
  styleUrls: ['speakers.page.scss']
})
export class SpeakersPage {
  _speakers = inject(SpeakerService);
  _loading = inject(IDEALoadingService);
  _message = inject(IDEAMessageService);
  _modal = inject(ModalController);

  speakers: Speaker[];

  async ionViewDidEnter(): Promise<void> {
    try {
      await this._loading.show();
      this.speakers = await this._speakers.getList({ force: true });
    } catch (error) {
      this._message.error('Error loading the list', true);
    } finally {
      this._loading.hide();
    }
  }

  async openSpeaker(speaker: Speaker): Promise<void> {
    /* const modal = await this._modal.create({
      component: SpeakerDetailComponent,
      componentProps: { speaker }
    });
    modal.present(); */
  }

  async manageSpeaker(speaker: Speaker): Promise<void> {
    /* const modal = await this._modal.create({
      component: ManageSpeakerComponent,
      componentProps: { speaker },
      backdropDismiss: false
    });
    modal.onDidDismiss().then(async (): Promise<void> => {
      this.speakers = await this._speakers.getList({ force: true });
    });
    await modal.present(); */
  }

  async addSpeaker(): Promise<void> {
    //await this.manageCommunication(new Communication());
  }
}
