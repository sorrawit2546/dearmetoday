import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.css'],
})
export class NoteCardComponent {
  @Input() date!: string;
  @Input() line1!: string;
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];

  currentIndex = 0;

  prevPhoto() {
    this.currentIndex =
      (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
  }
}
