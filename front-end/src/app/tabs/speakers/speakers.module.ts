import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'

import { SpeakerRoutingModule } from './speakers-routing.module';
import { SpeakerComponent } from './speaker.component';
import { SpeakersPage } from './speakers.page';
import { SpeakerDetailComponent } from './speakerDetail.component';
import { ManageSpeakerComponent } from './manageSpeaker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpeakerRoutingModule,
    SpeakerComponent,
    SpeakerDetailComponent,
    ManageSpeakerComponent
  ],
  declarations: [SpeakersPage]
})
export class SpeakersModule {}
