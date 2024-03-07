import { Injectable, inject } from '@angular/core';
import { IDEAApiService } from '@idea-ionic/common';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  _api = inject(IDEAApiService);
}
