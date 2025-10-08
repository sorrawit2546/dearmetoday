import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  signal,
} from '@angular/core';
import { NoteForm } from '../components/note-form/note-form';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, NoteForm],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.css'],
})
export class NoteCardComponent {
  @Input() id!: string;
  @Input() date!: string;
  @Input() line1: string = '';
  @Input() line2: string = '';
  @Input() line3: string = '';
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];

  // 🔹 State
  currentIndex = 0;
  isPortrait = false;
  private touchStartX: number | null = null;
  displayIsActive = false;

  // 🔹 Modal Signals
  showNoteForm = signal<boolean>(false);
  showDeleteDialog = signal<boolean>(false);

  // ─────────────────────────────────────────────
  // 📷 Photo Control
  prevPhoto() {
    if (this.photos.length > 0)
      this.currentIndex =
        (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextPhoto() {
    if (this.photos.length > 0)
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('Image failed to load:', img?.src || '(unknown)');
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.touchStartX == null) return;
    const deltaX = event.changedTouches[0]?.clientX - this.touchStartX;
    if (deltaX > 40) this.prevPhoto();
    else if (deltaX < -40) this.nextPhoto();
    this.touchStartX = null;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') this.prevPhoto();
    else if (event.key === 'ArrowRight') this.nextPhoto();
  }

  // ─────────────────────────────────────────────
  // ⚙️ Dropdown + Toggle
  toggleActive() {
    this.displayIsActive = !this.displayIsActive;
    console.log('toggleActive:', this.displayIsActive);
  }

  closeDropdown() {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl && activeEl.closest('.dropdown')) {
      activeEl.blur();
    }
  }

  // ─────────────────────────────────────────────
  // 🪶 Modal Controls
  openNoteForm() {
    console.log('openNoteForm called');
    this.showNoteForm.set(true);
  }

  closeNoteForm() {
    this.showNoteForm.set(false);
  }

  openDeleteDialog() {
    this.showDeleteDialog.set(true);
  }

  closeDeleteDialog() {
    this.showDeleteDialog.set(false);
  }

  confirmDelete() {
    console.log('Confirm delete note:', this.id);
    this.showDeleteDialog.set(false);
  }

  onCardClick(event: Event) {
    const target = event.target as HTMLElement;
    const isDropdownClick = target.closest('.dropdown');
    if (!isDropdownClick) console.log('Card clicked', this.id);
  }
}
