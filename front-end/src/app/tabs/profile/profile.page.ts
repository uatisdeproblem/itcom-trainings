import { Component, inject } from '@angular/core';

import { AppService } from '@app/app.service';

@Component({
  selector: 'profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {
  _app = inject(AppService);
}
