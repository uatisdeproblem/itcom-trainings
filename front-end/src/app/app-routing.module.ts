import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { initGuard } from './init.guard';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: (): Promise<any> => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [initGuard]
  },
  {
    path: '',
    loadChildren: (): Promise<any> => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [initGuard, authGuard]
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
