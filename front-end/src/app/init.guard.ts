import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Platform } from '@ionic/angular';
import { IDEAAppStatusService, IDEAStorageService, IDEATranslationsService } from '@idea-ionic/common';

import { AppService } from './app.service';

import { ServiceLanguages } from '@models/serviceLanguages.enum';

export const initGuard: CanActivateFn = async (): Promise<boolean> => {
  const platform = inject(Platform);
  const storage = inject(IDEAStorageService);
  const t = inject(IDEATranslationsService);
  const appStatus = inject(IDEAAppStatusService);
  const app = inject(AppService);

  if (app.initReady) return true;

  await platform.ready();
  await storage.ready();

  await t.init(Object.values(ServiceLanguages), ServiceLanguages.English);

  await appStatus.check();

  app.initReady = true;

  return true;
};
