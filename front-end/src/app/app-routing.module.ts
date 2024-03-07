import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { initGuard } from './init.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: (): Promise<any> => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [initGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      paramsInheritanceStrategy: 'always',
      bindToComponentInputs: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
