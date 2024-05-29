import { Injectable, inject } from '@angular/core';
import { IDEAApiService } from '@idea-ionic/common';

import { Speaker } from '@models/speaker.model';

@Injectable({ providedIn: 'root' })
export class SpeakerService {
  private speakers: Speaker[];

  /**
   * The number of speakers to consider for the pagination, when active.
   */
  MAX_PAGE_SIZE = 24;

  _api = inject(IDEAApiService);

  /**
   * Load the speakers from the back-end, possibly filtering by year.
   * If no year is specified, only the unarchived speakers are returned.
   */
  private async loadList(): Promise<void> {
    const speakers: Speaker[] = await this._api.getResource('speakers');
    this.speakers = speakers.map(x => new Speaker(x));
  }
  /**
   * Get (and optionally filter) the list of speakers.
   * Note: it's a slice of the array.
   */
  async getList(
    options: {
      force?: boolean;
      search?: string;
      withPagination?: boolean;
      startPaginationAfterId?: string;
    } = {}
  ): Promise<Speaker[]> {
    if (!this.speakers || options.force) await this.loadList();
    if (!this.speakers) return null;

    options.search = options.search ? String(options.search).toLowerCase() : '';

    let filteredList = this.speakers.slice();

    if (options.search)
      filteredList = filteredList.filter(x =>
        options.search
          .split(' ')
          .every(searchTerm =>
            [x.name].filter(f => f).some(f => f.toLowerCase().includes(searchTerm))
          )
      );

    filteredList = filteredList.sort((a, b): number => a.name.localeCompare(b.name));

    if (options.withPagination && filteredList.length > this.MAX_PAGE_SIZE) {
      let indexOfLastOfPreviousPage = 0;
      if (options.startPaginationAfterId)
        indexOfLastOfPreviousPage =
          filteredList.findIndex(x => x.speakerId === options.startPaginationAfterId) || 0;
      filteredList = filteredList.slice(0, indexOfLastOfPreviousPage + this.MAX_PAGE_SIZE);
    }

    return filteredList;
  }

  /**
   * Get a speaker by its id.
   */
  async getById(speakerId: string): Promise<Speaker> {
    return new Speaker(await this._api.getResource(['speakers', speakerId]));
  }

  /**
   * Insert a speaker.
   */
  async insert(speaker: Speaker): Promise<Speaker> {
    return new Speaker(await this._api.postResource('speakers', { body: speaker }));
  }

  /**
   * Update a speaker.
   */
  async update(speaker: Speaker): Promise<Speaker> {
    return new Speaker(
      await this._api.putResource(['speakers', speaker.speakerId], { body: speaker })
    );
  }

  /**
   * Delete an speaker.
   */
  async delete(speaker: Speaker): Promise<void> {
    await this._api.deleteResource(['speakers', speaker.speakerId]);
  }
}
