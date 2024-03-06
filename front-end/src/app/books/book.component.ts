import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IDEATranslationsModule } from '@idea-ionic/common';

import { BookSummary } from '@models/book.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, IDEATranslationsModule],
  selector: 'app-book',
  template: `
    @if(book){
    <ion-item class="bookItem" button (click)="select.emit()">
      <ion-label>
        {{ book.title }}
        <p>
          {{ book.author }}
          @if(book.ratingsCount > 0) { - <b>{{ book.rating }}/5</b> ({{ book.ratingsCount }}) }
        </p>
      </ion-label>
      <ion-badge slot="end" [color]="genreColors[book.genre]">{{ book.genre }}</ion-badge>
    </ion-item>
    } @else {
    <ion-item class="bookItem">
      <ion-label>
        <ion-skeleton-text animated style="width: 70%" />
        <p><ion-skeleton-text animated style="width: 50%" /></p>
      </ion-label>
    </ion-item>
    }
  `
})
export class BookStandaloneComponent {
  /**
   * The book to show.
   * If undefined, show a skeleton instead.
   */
  @Input() book?: BookSummary;
  /**
   * Trigger for a book selection.
   */
  @Output() select = new EventEmitter<void>();

  genreColors = BOOK_GENDER_COLORS;

  constructor() {}
}

const BOOK_GENDER_COLORS = {
  Action: 'primary',
  Adventure: 'secondary',
  Drama: 'tertiary',
  Fantasy: 'medium'
};
