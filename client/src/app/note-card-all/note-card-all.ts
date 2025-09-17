import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NoteForm } from '../components/note-form/note-form';
import { Api } from '../services/api';

@Component({
  selector: 'app-note-card-all',
  standalone: true,
  imports: [CommonModule, NoteForm],
  templateUrl: './note-card-all.html',
  styleUrls: ['./note-card-all.css'],
})
export class NoteCardAll implements OnInit, OnChanges {
  @Input() id!: string;
  @Input() date!: string;
  @Input() line1: string = '';
  @Input() line2: string = '';
  @Input() line3: string = '';
  @Input() mood!: string;
  @Input() email!: string;
  @Input() photos: string[] = [];
  @Input() name?: string;
  @Input() avatarUrl?: string;

  @Input() isActive = false;
  @Output() isActiveChange = new EventEmitter<boolean>();
  @Output() cardClick = new EventEmitter<void>();

  // Local state สำหรับ toggle
  private _localIsActive = false;
  private _isToggling = false;

  constructor(private router: Router, private apiService: Api) {
    this.isCommunity = this.router.url.includes('/community');
  }

  toggleActive() {
    // ป้องกันการ toggle ซ้ำ
    if (this._isToggling) return;
    this._isToggling = true;

    // ใช้ local state แทน input state
    this._localIsActive = !this._localIsActive;

    // แจ้ง parent
    this.isActiveChange.emit(this._localIsActive);

    // ยิง API
    const formData = new FormData();
    formData.append('showMessage', String(this._localIsActive));
    this.apiService.editPositiveNoteById(this.id, formData).subscribe({
      next: () => {
        console.log('isActive updated on server');
        this._isToggling = false;
      },
      error: (err) => {
        console.error('Failed to update isActive', err);
        // revert กลับถ้า error
        this._localIsActive = !this._localIsActive;
        this.isActiveChange.emit(this._localIsActive);
        this._isToggling = false;
      },
    });
  }

  isCommunity = false;
  showNoteForm = signal<boolean>(false);
  private refreshTrigger = signal<number>(0);
  refreshData(): void {
    this.refreshTrigger.update((trigger) => trigger + 1);
  }

  ngOnInit() {
    // Initialize local state จาก input
    this._localIsActive = this.isActive;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isActive']) {
      // Sync local state กับ input เมื่อ parent อัพเดต
      this._localIsActive = changes['isActive'].currentValue;
    }
  }

  // Getter สำหรับแสดงผลใน template
  get displayIsActive(): boolean {
    return this._localIsActive;
  }

  currentIndex = 0;
  isPortrait = false;
  private touchStartX: number | null = null;

  openNoteForm(): void {
    this.showNoteForm.set(true);
  }

  closeNoteForm(): void {
    this.showNoteForm.set(false);
    this.refreshData();
  }

  closeDropdown(): void {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl && activeEl.closest('.dropdown')) {
      activeEl.blur();
    }
  }

  onCardClick(event: Event): void {
    console.log('onCardClick called', event.target);
    // ตรวจสอบว่าไม่ได้คลิกที่ dropdown menu เท่านั้น
    const target = event.target as HTMLElement;
    const isDropdownClick = target.closest('.dropdown');

    console.log('isDropdownClick:', isDropdownClick);

    if (!isDropdownClick) {
      console.log('Emitting cardClick');
      this.cardClick.emit();
    } else {
      console.log('Dropdown click, not emitting cardClick');
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
    if (deltaX > 40) this.prevPhoto();
    else if (deltaX < -40) this.nextPhoto();
    this.touchStartX = null;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') this.prevPhoto();
    else if (event.key === 'ArrowRight') this.nextPhoto();
  }
}
