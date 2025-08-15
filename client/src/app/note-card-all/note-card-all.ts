import { Component, Input, signal } from '@angular/core';
import { NgClass } from '@angular/common';

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
  cardData: CardData[] = [
    {
      id: 1,
      date: '15/01/25',
      title: 'Morning Routine',
      details: 'Wake up, exercise, breakfast, check emails...',
      photos: [
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200',
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=1200',
      ],
    },
    {
      id: 2,
      date: '15/01/25',
      title: 'Work Tasks',
      details: 'Finish project report, attend meeting, code review...',
      photos: [
        'https://source.unsplash.com/random/400x200?office',
        'https://source.unsplash.com/random/400x200?laptop',
      ],
    },
    {
      id: 3,
      date: '16/01/25',
      title: 'Workout',
      details: 'Gym session: cardio & strength training...',
      photos: [
        'https://source.unsplash.com/random/400x200?gym',
        'https://source.unsplash.com/random/400x200?weights',
      ],
    },
    // เพิ่ม card อื่น ๆ แบบเดียวกัน...
  ];

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
