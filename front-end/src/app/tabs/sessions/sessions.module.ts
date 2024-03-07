import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsPage } from './sessions.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SessionsRoutingModule],
  declarations: [SessionsPage]
})
export class SessionsModule {}
