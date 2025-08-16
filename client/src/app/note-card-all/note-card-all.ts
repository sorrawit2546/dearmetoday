import { Component, Input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { resolve } from 'url';

@Component({
  selector: 'app-note-card-all',
  imports: [NgClass],
  templateUrl: './note-card-all.html',
  styleUrl: './note-card-all.css',
})
export class NoteCardAll {

  hoveredCard = signal<number | null>(null);
  @Input() date!: string;
  @Input() line1!: string;
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];

  setHoveredCard(id: number | null) {
    this.hoveredCard.set(id);
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
