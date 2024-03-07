import { Injectable, inject } from '@angular/core';
import { IDEAApiService } from '@idea-ionic/common';

@Injectable({ providedIn: 'root' })
export class CommunicationsService {
  _api = inject(IDEAApiService);
}
