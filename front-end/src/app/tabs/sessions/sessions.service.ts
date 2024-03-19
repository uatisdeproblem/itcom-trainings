import { Injectable, inject } from '@angular/core';
import { IDEAApiService } from '@idea-ionic/common';

import { Session } from '@models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private sessions: Session[];

  /**
   * The number of sessions to consider for the pagination, when active.
   */
  MAX_PAGE_SIZE = 24;

  _api = inject(IDEAApiService);

  /**
   * Load the sessions from the back-end.
   * If no year is specified, only the unarchived sessions are returned.
   */
  private async loadList(): Promise<void> {
    const sessions: Session[] = await this._api.getResource('sessions');
    this.sessions = sessions.map(x => new Session(x));
  }
  /**
   * Get (and optionally filter) the list of sessions.
   * Note: it's a slice of the array.
   */
  async getList(
    options: {
      force?: boolean;
      search?: string;
      withPagination?: boolean;
      startPaginationAfterId?: string;
    } = {}
  ): Promise<Session[]> {
    if (!this.sessions || options.force) await this.loadList();
    if (!this.sessions) return null;

    options.search = options.search ? String(options.search).toLowerCase() : '';

    let filteredList = this.sessions.slice();

    if (options.search)
      filteredList = filteredList.filter(x =>
        options.search
          .split(' ')
          .every(searchTerm =>
            [x.name, x.brief, x.content, x.room].filter(f => f).some(f => f.toLowerCase().includes(searchTerm))
          )
      );

    filteredList = filteredList.sort((a, b): number => a.startsAt.localeCompare(b.startsAt));

    if (options.withPagination && filteredList.length > this.MAX_PAGE_SIZE) {
      let indexOfLastOfPreviousPage = 0;
      if (options.startPaginationAfterId)
        indexOfLastOfPreviousPage = filteredList.findIndex(x => x.sessionId === options.startPaginationAfterId) || 0;
      filteredList = filteredList.slice(0, indexOfLastOfPreviousPage + this.MAX_PAGE_SIZE);
    }

    return filteredList;
  }

  /**
   * Get a session by its id.
   */
  async getById(sessionId: string): Promise<Session> {
    return new Session(await this._api.getResource(['sessions', sessionId]));
  }

  /**
   * Insert a session.
   */
  async insert(session: Session): Promise<Session> {
    return new Session(await this._api.postResource('sessions', { body: session }));
  }

  /**
   * Update a session.
   */
  async update(session: Session): Promise<Session> {
    return new Session(await this._api.putResource(['sessions', session.sessionId], { body: session }));
  }

  /**
   * Delete a session.
   */
  async delete(session: Session): Promise<void> {
    await this._api.deleteResource(['sessions', session.sessionId]);
  }

  /**
   * Register to the session.
   */
  async register(session: Session): Promise<Session> {
    const body = { action: 'REGISTER' };
    return new Session(await this._api.patchResource(['sessions', session.sessionId], { body }));
  }

  /**
   * Cancel the registration to the session.
   */
  async cancelRegistration(session: Session): Promise<Session> {
    const body = { action: 'CANCEL_REGISTRATION' };
    return new Session(await this._api.patchResource(['sessions', session.sessionId], { body }));
  }
}
