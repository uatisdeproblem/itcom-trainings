import { Component } from '@angular/core';

import { AppService } from '../app.service';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {
  constructor(public app: AppService) {}
}
