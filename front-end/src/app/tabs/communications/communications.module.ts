import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CommunicationsPage } from './communications.page';

import { CommunicationsRoutingModule } from './communications-routing.module';
import { ManageCommunicationComponent } from './manageCommunication.component';
import { CommunicationDetailComponent } from './communicationDetail.component';
import { CommunicationComponent } from './communication.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationsRoutingModule,
    CommunicationComponent,
    CommunicationDetailComponent,
    ManageCommunicationComponent
  ],
  declarations: [CommunicationsPage]
})
export class CommunicationsModule {}
