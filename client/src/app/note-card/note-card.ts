import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.css'],
})
export class NoteCardComponent implements OnChanges {
  @Input() date!: string;
  @Input() line1!: string;
  @Input() line2!: string;
  @Input() line3!: string;
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];

  ngOnInit() {
    console.log('NoteCard Inputs:', {
      date: this.date,
      line1: this.line1,
      mood: this.mood,
      email: this.email,
      photos: this.photos,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('NoteCard ngOnChanges:', changes);
  }

  currentIndex = 0;
  isPortrait = false;
  private touchStartX: number | null = null;

  prevPhoto() {
    this.currentIndex =
      (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img || !img.naturalWidth || !img.naturalHeight) {
      this.isPortrait = false;
      return;
    }
    this.isPortrait = img.naturalHeight >= img.naturalWidth;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.touchStartX == null) return;
    const deltaX = event.changedTouches[0]?.clientX - this.touchStartX;
    // Swipe threshold ~40px
    if (deltaX > 40) {
      this.prevPhoto();
    } else if (deltaX < -40) {
      this.nextPhoto();
    }
    this.touchStartX = null;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevPhoto();
    } else if (event.key === 'ArrowRight') {
      this.nextPhoto();
    }
  }
}
