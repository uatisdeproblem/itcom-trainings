import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ChecklistPage } from './checklist.page';

import { ChecklistRoutingModule } from './checklist-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChecklistRoutingModule],
  declarations: [ChecklistPage]
})
export class ChecklistModule {}
