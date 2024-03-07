import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  { path: '', redirectTo: '/tabs/communications', pathMatch: 'full' },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: '', redirectTo: '/tabs/communications', pathMatch: 'full' },
      {
        path: 'communications',
        loadChildren: (): Promise<any> =>
          import('./communications/communications.module').then(m => m.CommunicationsModule)
      },
      {
        path: 'sessions',
        loadChildren: (): Promise<any> => import('./sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class TabsPageRoutingModule {}
