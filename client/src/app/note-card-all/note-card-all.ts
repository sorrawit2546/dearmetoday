import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { sign } from 'node:crypto';
import { NoteForm } from '../components/note-form/note-form';

@Component({
  selector: 'app-note-card-all',
  standalone: true,
  imports: [CommonModule, NoteForm],
  templateUrl: './note-card-all.html',
  styleUrls: ['./note-card-all.css'],
})
export class NoteCardAll implements OnChanges {
  // date = input<string>;
  @Input() id!: string;
  @Input() date!: string;
  @Input() line1: string = '';
  @Input() line2: string = '';
  @Input() line3: string = '';
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];
  //optional
  @Input() name?: string;
  @Input() avatarUrl?: string;
  //
  @Input() isActive = false;

  isCommunity = false;
  showNoteForm = signal<boolean>(false);
  private refreshTrigger = signal<number>(0);
  refreshData(): void {
    this.refreshTrigger.update((trigger) => trigger + 1);
  }

  constructor(private router: Router) {
    this.isCommunity = this.router.url.includes('/community');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('NoteCardAll ngOnChanges:', changes);
  }

  currentIndex = 0;
  isPortrait = false;
  private touchStartX: number | null = null;

  openNoteForm(): void {
    this.showNoteForm.set(true);
  }

  closeNoteForm(): void {
    this.showNoteForm.set(false);
    // Refresh data หลังจากปิด form
    this.refreshData();
  }

  closeDropdown(): void {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl && activeEl.closest('.dropdown')) {
      activeEl.blur(); // เอาโฟกัสออกจาก dropdown trigger → dropdown ปิด
    }
  }

  prevPhoto() {
    this.currentIndex =
      (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    console.log('Image loaded successfully:', img.src);
    if (!img || !img.naturalWidth || !img.naturalHeight) {
      this.isPortrait = false;
      return;
    }
    this.isPortrait = img.naturalHeight >= img.naturalWidth;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('Image failed to load:', img.src);
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
