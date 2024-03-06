import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { IDEAApiService, IDEAStorageService } from '@idea-ionic/common';

import { AppService } from './app.service';

export const authGuard: CanActivateFn = async (): Promise<boolean> => {
  const platform = inject(Platform);
  const navCtrl = inject(NavController);
  const storage = inject(IDEAStorageService);
  const api = inject(IDEAApiService);
  const app = inject(AppService);

  if (app.authReady) return true;

  //
  // HELPERS
  //

  const doAuth = async (): Promise<void> => {
    // @todo
  };

  const navigateAndResolve = (navigationPath?: string[]): boolean => {
    if (navigationPath) navCtrl.navigateRoot(navigationPath);
    app.authReady = true;
    return true;
  };

  //
  // MAIN
  //

  if (app.authReady) return true;

  await platform.ready();
  await storage.ready();

  try {
    await doAuth();
    platform.resume.subscribe((): Promise<void> => doAuth());

    if (window.location.pathname === '/') return navigateAndResolve([]);
    return navigateAndResolve();
  } catch (err) {
    return navigateAndResolve(['auth']);
  }
};
