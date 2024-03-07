import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CommunicationsPage } from './communications.page';
import { CommunicationsRoutingModule } from './communications-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CommunicationsRoutingModule],
  declarations: [CommunicationsPage]
})
export class CommunicationsModule {}
