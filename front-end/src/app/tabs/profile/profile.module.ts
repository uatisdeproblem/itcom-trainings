import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfileRoutingModule],
  declarations: [ProfilePage]
})
export class ProfileModule {}
