import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { IDEAApiService, IDEAMessageService, IDEATranslationsService, IDEAStorageService } from '@idea-ionic/common';

import { environment as env } from '@env';
import { User } from '@models/user.model';

/**
 * The base URLs where the thumbnails are located.
 */
const THUMBNAILS_BASE_URL = env.idea.app.mediaUrl.concat('/images/', env.idea.api.stage, '/');
/**
 * The local URL to the icon.
 */
const APP_ICON_PATH = './assets/icons/icon.svg';
/**
 * The local URL to the icon.
 */
const APP_ICON_WHITE_PATH = './assets/icons/star-white.svg';

@Injectable({ providedIn: 'root' })
export class AppService {
  initReady = false;
  authReady = false;

  private darkMode: boolean;

  user: User;

  private _storage = inject(IDEAStorageService);
  private _platform = inject(Platform);
  private _navCtrl = inject(NavController);
  private _alertCtrl = inject(AlertController);
  private _message = inject(IDEAMessageService);
  private _api = inject(IDEAApiService);
  private _t = inject(IDEATranslationsService);

  constructor() {
    this.darkMode = this.respondToColorSchemePreferenceChanges();
  }
  private respondToColorSchemePreferenceChanges(): boolean {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => (this.darkMode = e.matches));
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Whether we are running the app in developer mode (from localhost).
   */
  isDeveloperMode(): boolean {
    return env.debug;
  }
  /**
   * Open an alert to get the token for running requests against this project's API.
   */
  async getTokenId(): Promise<void> {
    const message = typeof this._api.authToken === 'function' ? await this._api.authToken() : this._api.authToken;
    const alert = await this._alertCtrl.create({ message, buttons: ['Thanks 🙌'], cssClass: 'selectable' });
    alert.present();
  }

  /**
   * Whether we should display a UX designed for smaller screens.
   */
  isInMobileMode(): boolean {
    return this._platform.width() < 768;
  }
  /**
   * Whether the current color scheme preference is set to dark.
   */
  isInDarkMode(): boolean {
    return this.darkMode;
  }

  /**
   * Reload the app.
   */
  reloadApp(): void {
    window.location.assign('');
  }
  /**
   * Navigate to a page by its path.
   */
  goTo(path: string[], options: { back?: boolean; root?: boolean; queryParams?: Params } = {}): void {
    if (options.back) this._navCtrl.navigateBack(path, options);
    else if (options.root) this._navCtrl.navigateRoot(path, options);
    else this._navCtrl.navigateForward(path, options);
  }
  /**
   * Close the current page and navigate back, optionally displaying an error message.
   */
  closePage(errorMessage?: string, pathBack?: string[]): void {
    if (errorMessage) this._message.error(errorMessage);
    try {
      this._navCtrl.back();
    } catch (_) {
      this._navCtrl.navigateBack(pathBack || []);
    }
  }

  /**
   * Get the URL to an image by its URI.
   */
  getImageURLByURI(imageURI: string): string {
    return THUMBNAILS_BASE_URL.concat(imageURI, '.png');
  }

  /**
   * Show some app's info.
   */
  async info(): Promise<void> {
    const openPrivacyPolicy = (): Promise<void> =>
      Browser.open({ url: this._t._('IDEA_VARIABLES.PRIVACY_POLICY_URL') });

    const header = this._t._('COMMON.APP_NAME');
    const message = this._t._('COMMON.VERSION', { v: env.idea.app.version });
    const buttons = [
      { text: this._t._('IDEA_AUTH.PRIVACY_POLICY'), handler: openPrivacyPolicy },
      { text: this._t._('COMMON.CLOSE') }
    ];

    const alert = await this._alertCtrl.create({ header, message, buttons });
    alert.present();
  }

  /**
   * Get the app's main icon.
   */
  getIcon(white = false): string {
    return white ? APP_ICON_WHITE_PATH : APP_ICON_PATH;
  }

  /**
   * Sign-out from the current user.
   */
  async logout(): Promise<void> {
    const doLogout = async (): Promise<void> => {
      await this._storage.clear();
      this.reloadApp();
    };

    const header = this._t._('COMMON.LOGOUT');
    const message = this._t._('COMMON.ARE_YOU_SURE');
    const buttons = [{ text: this._t._('COMMON.CANCEL') }, { text: this._t._('COMMON.LOGOUT'), handler: doLogout }];

    const alert = await this._alertCtrl.create({ header, message, buttons });
    alert.present();
  }
}
