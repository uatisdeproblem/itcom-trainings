import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Speaker } from '@models/speaker.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  selector: 'app-speaker-detail',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="close()"> <ion-icon slot="start" icon="close" /> Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content color="white">
      <ion-card color="white">
        <ion-card-header>
          <ion-card-title>
            <ion-text color="medium" style="font-weight: 600">
              {{ speaker.name }}
            </ion-text>
          </ion-card-title>
        </ion-card-header>
        @if(speaker.imageURL) { <ion-img [src]="speaker.imageURL" /> }
      </ion-card>
    </ion-content>
  `,
  styles: [
    `
      ion-card {
        margin: 0 0 20px 0;
        padding: 0 16px;
        width: 100%;
        box-shadow: none !important;
      }
      ion-card-header ion-card-subtitle {
        color: var(--ion-color-step-500);
      }
      ion-img {
        object-fit: cover;
        height: 180px;
      }
      ion-img::part(image) {
        border-radius: 8px;
      }
      ion-textarea {
        background-color: var(--ion-color-light);
        padding: 10px 20px;
      }
    `
  ]
})
export class SpeakerDetailComponent {
  /**
   * The communication to show.
   */
  @Input() speaker: Speaker;

  _modal = inject(ModalController);

  close(): void {
    this._modal.dismiss();
  }
}
