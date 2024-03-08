import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, inject } from '@angular/core';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { IDEALoadingService, IDEAMessageService } from '@idea-ionic/common';

import { AppService } from '@app/app.service';
import { MediaService } from '@app/common/media.service';
import { CommunicationsService } from './communications.service';

import { Communication } from '@models/communication.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  selector: 'app-manage-communication',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button (click)="close()">
            <ion-icon slot="icon-only" icon="close-circle" />
          </ion-button>
        </ion-buttons>
        <ion-title>Manage communication</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="save()">
            <ion-icon slot="icon-only" icon="checkmark-circle" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list lines="full">
        <ion-item [class.fieldHasError]="hasFieldAnError('name')">
          <ion-label position="floating">Name</ion-label>
          <ion-input [(ngModel)]="communication.name" />
        </ion-item>
        <ion-item [class.fieldHasError]="hasFieldAnError('brief')">
          <ion-label position="floating">Brief</ion-label>
          <ion-input [(ngModel)]="communication.brief" />
        </ion-item>
        <ion-item [class.fieldHasError]="hasFieldAnError('imageURL')">
          <ion-label position="floating">Image URL</ion-label>
          <ion-input [(ngModel)]="communication.imageURL" />
          <input type="file" accept="image/*" style="display: none" id="upload-image" (change)="uploadImage($event)" />
          <ion-button
            slot="end"
            fill="clear"
            color="medium"
            class="ion-margin-top"
            (click)="browseImagesForElementId('upload-image')"
          >
            <ion-icon icon="cloud-upload-outline" slot="icon-only" />
          </ion-button>
        </ion-item>
        <ion-item [class.fieldHasError]="hasFieldAnError('event')">
          <ion-label position="floating">Event name</ion-label>
          <ion-input [(ngModel)]="communication.event"></ion-input>
        </ion-item>
        <ion-item [class.fieldHasError]="hasFieldAnError('content')">
          <ion-label position="floating">Content</ion-label>
          <ion-textarea rows="5" [(ngModel)]="communication.content"></ion-textarea>
        </ion-item>
        @if(communication.communicationId) {
        <ion-row class="ion-padding-top">
          <ion-col class="ion-text-end">
            <ion-button color="danger" (click)="askAndDelete()">Delete</ion-button>
          </ion-col>
        </ion-row>
        }
      </ion-list>
    </ion-content>
  `
})
export class ManageCommunicationComponent {
  /**
   * The communication to manage.
   */
  @Input() communication: Communication;

  errors = new Set<string>();

  _modal = inject(ModalController);
  _alert = inject(AlertController);
  _loading = inject(IDEALoadingService);
  _message = inject(IDEAMessageService);
  _communications = inject(CommunicationsService);
  _media = inject(MediaService);
  _app = inject(AppService);

  hasFieldAnError(field: string): boolean {
    return this.errors.has(field);
  }

  browseImagesForElementId(elementId: string): void {
    document.getElementById(elementId).click();
  }
  async uploadImage({ target }): Promise<void> {
    const file = target.files[0];
    if (!file) return;

    try {
      await this._loading.show();
      const imageURI = await this._media.uploadImage(file);
      this.communication.imageURL = this._app.getImageURLByURI(imageURI);
    } catch (error) {
      this._message.error('Operation failed', true);
    } finally {
      if (target) target.value = '';
      this._loading.hide();
    }
  }

  async save(): Promise<void> {
    this.errors = new Set(this.communication.validate());
    if (this.errors.size) return this._message.error('Please check the obligatory fields', true);

    try {
      await this._loading.show();
      let result: Communication;
      if (!this.communication.communicationId) result = await this._communications.insert(this.communication);
      else result = await this._communications.update(this.communication);
      this.communication.load(result);
      this._message.success('Communication saved', true);
      this.close();
    } catch (err) {
      this._message.error('Operation failed', true);
    } finally {
      this._loading.hide();
    }
  }
  close(): void {
    this._modal.dismiss();
  }

  async askAndDelete(): Promise<void> {
    const doDelete = async (): Promise<void> => {
      try {
        await this._loading.show();
        await this._communications.delete(this.communication);
        this._message.success('Operation completed', true);
        this.close();
      } catch (error) {
        this._message.error('Operation failed', true);
      } finally {
        this._loading.hide();
      }
    };
    const header = 'Are you sure';
    const message = 'The action is irreversible';
    const buttons = [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive', handler: doDelete }
    ];
    const alert = await this._alert.create({ header, message, buttons });
    alert.present();
  }
}
