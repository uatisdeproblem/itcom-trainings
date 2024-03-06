import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { initGuard } from './init.guard';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'app-status',
    loadChildren: (): Promise<any> => import('@idea-ionic/common').then(m => m.IDEAAppStatusModule),
    canActivate: [initGuard]
  },
  {
    path: 'dashboard',
    loadChildren: (): Promise<any> => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [initGuard, authGuard]
  },
  {
    path: 'books',
    loadChildren: (): Promise<any> => import('./books/books.module').then(m => m.BooksModule),
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
