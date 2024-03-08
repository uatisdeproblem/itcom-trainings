import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { Communication } from '@models/communication.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-communication',
  template: `
    <ion-card [color]="color" button (click)="select.emit()">
      <ion-img [src]="communication.imageURL" />
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
        <ion-card-subtitle class="ion-text-end">
          <ion-button (click)="edit.emit(); $event.stopPropagation()" fill="clear" size="small">
            <ion-icon name="pencil" />
          </ion-button>
        </ion-card-subtitle>
      </ion-card-header>
    </ion-card>
  `,
  styles: [
    `
      ion-card {
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        margin: 0 4px 16px 4px;
        height: 100%;
      }
      ion-img {
        object-fit: cover;
        height: 180px;
        border-bottom: 1px solid var(--ion-color-light);
      }
      ion-card-subtitle:first-of-type {
        color: var(--ion-color-step-500);
      }
      ion-card-subtitle:nth-of-type(2) {
        font-weight: 400;
      }
    `
  ]
})
export class CommunicationComponent {
  /**
   * The communication to show.
   */
  @Input() communication: Communication;
  /**
   * The color for the component.
   */
  @Input() color = 'white';
  /**
   * Trigger when selected.
   */
  @Output() select = new EventEmitter<void>();
  /**
   * Trigger when we want to edit the data.
   */
  @Output() edit = new EventEmitter<void>();
}
