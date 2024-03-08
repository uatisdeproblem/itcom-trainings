import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { Communication } from '@models/communication.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  selector: 'app-communication-detail',
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
          <ion-card-subtitle>{{ communication.date | date }}</ion-card-subtitle>
          <ion-card-title>
            <ion-text color="medium" style="font-weight: 600">
              {{ communication.event }}
            </ion-text>
            @if(communication.event) { - }
            {{ communication.name }}
          </ion-card-title>
          <ion-card-subtitle>{{ communication.brief }}</ion-card-subtitle>
        </ion-card-header>
        @if(communication.imageURL) { <ion-img [src]="communication.imageURL" /> }
        <ion-textarea class="ion-margin-top" [innerHtml]="communication.content" />
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
export class CommunicationDetailComponent {
  /**
   * The communication to show.
   */
  @Input() communication: Communication;

  _modal = inject(ModalController);

  close(): void {
    this._modal.dismiss();
  }
}
