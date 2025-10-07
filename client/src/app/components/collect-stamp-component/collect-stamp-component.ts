import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { entryNote } from '../../model/entry-note';
import { firstValueFrom } from 'rxjs';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-collect-stamp-component',
  imports: [CommonModule, DatePipe, Header, Footer],
  templateUrl: './collect-stamp-component.html',
  styleUrl: './collect-stamp-component.css',
})
export class CollectStampComponent implements OnInit {
  constructor(private readonly apiService: Api) {}

  calendarDays = signal<{ date: string; image?: string; notes: entryNote[] }[]>(
    []
  );
  selectedNotes: entryNote[] = [];
  showModal = false;
  currentMonth = signal<string>(this.formatMonth(new Date()));
  isTransitioning = signal<boolean>(false);

  ngOnInit() {
    this.loadMonth(this.currentMonth());
  }

  formatMonth(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  async loadMonth(month: string) {
    const allNotes: entryNote[] = await firstValueFrom(
      this.apiService.getAllNoteByUserId()
    );

    // ✅ กรองเฉพาะ note ที่ยังไม่ถูกลบ
    const activeNotes = allNotes.filter((note) => !note.isDelete);

    const filtered = activeNotes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      const monthStr = `${noteDate.getFullYear()}-${String(
        noteDate.getMonth() + 1
      ).padStart(2, '0')}`;
      return monthStr === month;
    });

    const grouped: Record<string, entryNote[]> = {};
    filtered.forEach((note) => {
      const dateKey = new Date(note.createdAt).toISOString().split('T')[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(note);
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    const [year, monthNum] = month.split('-').map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    this.calendarDays.set(
      Array.from({ length: daysInMonth }, (_, i) => {
        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(
          i + 1
        ).padStart(2, '0')}`;

        const notes = grouped[dateStr] || [];
        let image: string | undefined;

        if (notes.length > 0) {
          const lastNote = notes[notes.length - 1];
          // ใช้รูปจาก note ล่าสุดถ้ามี
          if (lastNote.imageUrls && lastNote.imageUrls.length > 0) {
            image = lastNote.imageUrls[0];
          } else {
            // ถ้าไม่มีรูป → ใช้ stamp mood
            image = this.getStampImage(lastNote.mood);
          }
        }

        return { date: dateStr, image, notes };
      })
    );
  }

  changeMonth(offset: number) {
    const [year, month] = this.currentMonth().split('-').map(Number);
    const newDate = new Date(year, month - 1 + offset, 1);
    const newMonth = this.formatMonth(newDate);

    this.isTransitioning.set(true);
    setTimeout(() => {
      this.currentMonth.set(newMonth);
      this.loadMonth(newMonth);
      this.isTransitioning.set(false);
    }, 250);
  }

  openNotes(day: { date: string; notes: entryNote[] }) {
    this.selectedNotes = day.notes;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  getStampImage(mood: string): string {
    switch (mood?.toLowerCase()) {
      case 'happy':
        return '/assets/stamps/stamp-happy.png';
      case 'calm':
        return '/assets/stamps/stamp-calm.png';
      case 'neutral':
        return '/assets/stamps/stamp-neutral.png';
      case 'tired':
        return '/assets/stamps/stamp-tired.png';
      case 'sad':
        return '/assets/stamps/stamp-sad.png';
      default:
        return '/assets/stamps/stamp-generic.png';
    }
  }

  // สำหรับ swipe
  touchStartX = 0;
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  onTouchEnd(e: TouchEvent) {
    const diff = e.changedTouches[0].screenX - this.touchStartX;
    if (diff > 80) this.changeMonth(-1); // ปัดขวา → เดือนก่อน
    if (diff < -80) this.changeMonth(1); // ปัดซ้าย → เดือนถัดไป
  }

  selectedImage: string | null = null;

  selectedImageIndex: number | null = null;
  selectedImageList: string[] = [];

  // เปิด Lightbox พร้อมรายการภาพทั้งหมดใน note
  openImage(images: string[], index: number) {
    this.selectedImageList = images;
    this.selectedImageIndex = index;
  }

  // ปิด Lightbox
  closeImage() {
    this.selectedImageIndex = null;
    this.selectedImageList = [];
  }

  // เลื่อนไปภาพถัดไป
  nextImage() {
    if (this.selectedImageList.length && this.selectedImageIndex !== null) {
      this.selectedImageIndex =
        (this.selectedImageIndex + 1) % this.selectedImageList.length;
    }
  }

  // เลื่อนไปภาพก่อนหน้า
  prevImage() {
    if (this.selectedImageList.length && this.selectedImageIndex !== null) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.selectedImageList.length) %
        this.selectedImageList.length;
    }
  }

  // Gesture touch สำหรับ mobile
  onImageTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onImageTouchEnd(e: TouchEvent) {
    const diff = e.changedTouches[0].screenX - this.touchStartX;
    if (diff > 60) this.prevImage(); // ปัดขวา ← ภาพก่อนหน้า
    if (diff < -60) this.nextImage(); // ปัดซ้าย → ภาพถัดไป
  }
}
