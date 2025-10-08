import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { NoteForm } from '../../components/note-form/note-form';
import { ToastComponent } from '../../components/toast/toast.component';
import { entryNote } from '../../model/entry-note';
import { NoteCardAll } from '../../note-card-all/note-card-all';
import { NoteCardComponent } from '../../note-card/note-card';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { SummaryService } from '../../services/summary.service';
import { ToastService } from '../../services/toast.service';
import { PopUp } from '../../components/pop-up/pop-up';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NoteForm,
    NoteCardComponent,
    NoteCardAll,
    Header,
    ToastComponent,
    Footer,
    PopUp
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  // Services
  private authSubscription: Subscription | null = null;
  private authService = inject(AuthService);
  private apiService = inject(Api);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private summaryService = inject(SummaryService);

  // State signals
  summary = this.summaryService.summary;
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  isAuthed = computed(() => !!this.user());
  quickNoteFromLocalStorage = signal<string>('');
  pending = signal<boolean>(false);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  retryCount = signal<number>(0);
  maxRetries = 3;
  countNote = signal<number>(0);
  itemsNoteSearch = signal<(entryNote & { isActive: boolean })[]>([]);
  searchTerm = signal('');
  searchDate = signal('');
  selectedWeek = signal<'current' | 'prev'>('current');

  // Dashboard stats computed values
  weeklyAverage = computed(() => {
    const s = this.summary();
    if (!s?.weekly?.currentWeek?.avgMood) return '-';
    return s.weekly.currentWeek.avgMood.toFixed(1);
  });

  weeklyMoodEntries = computed(() => {
    const s = this.summary();
    if (!s?.weekly?.currentWeek?.count) return '-';
    return s.weekly.currentWeek.count.toString();
  });

  weeklyProgress = computed(() => {
    const s = this.summary();
    if (!s?.weekly?.diffPercent) return '-%';
    return s.weekly.diffPercent > 0
      ? `+${s.weekly.diffPercent.toFixed(1)}%`
      : `${s.weekly.diffPercent.toFixed(1)}%`;
  });

  weeklyMoodData = computed(() => {
    const s = this.summary();
    if (!s?.daily) return;

    const key = this.selectedWeek() === 'current' ? 'currentWeek' : 'prevWeek';
    const weekData = s.daily[key];

    if (!weekData || weekData.length === 0) return;

    return weekData.map((day) => ({
      date: this.formatDate(day.date),
      mood: day.avgMood || 3,
      count: day.count || 0,
    }));
  });

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 9;
  activeCard: number | null = null;

  // Refresh triggers
  private refreshTrigger = signal<number>(0);
  private shouldRefresh = computed(() => {
    const u = this.user();
    return u && this.refreshTrigger() > 0;
  });

  openNoteForm(): void {
    this.showNoteForm.set(true);
  }

  // Recent / all note
  entry_recent_note = signal<entryNote>({
    id: '',
    email: '',
    line1: '',
    line2: '',
    line3: '',
    imageUrls: [],
    mood: '',
    createdAt: new Date(),
    showMessage: false,
  });

  entry_all_note = signal<entryNote>({
    id: '',
    email: '',
    line1: '',
    line2: '',
    line3: '',
    imageUrls: [],
    mood: '',
    createdAt: new Date(),
    showMessage: false,
  });

  hasRecentNote = computed(() => this.entry_recent_note().id !== '');
  hasAllNote = computed(() => this.entry_all_note().id !== '');

  // Modal state
  showNoteForm = signal<boolean>(false);

  constructor() {
    // โหลด notes ครั้งแรก
    effect(() => {
      this.apiService.getAllNoteByUserId().subscribe({
        next: (res) => this.itemsNoteSearch.set(this.normalizeNotes(res)),
      });
    });

    // เมื่อมีการแก้ไข note ที่ไหนก็ reload
    this.apiService.positiveNoteChanged$.subscribe(() => {
      this.ngZone.run(() => {
        this.apiService.getAllNoteByUserId().subscribe({
          next: (res) => this.itemsNoteSearch.set(this.normalizeNotes(res)),
        });
        this.loadRecentNote();
        this.loadNotesCount();
      });
    });

    // โหลดข้อมูลเมื่อ user พร้อม
    effect(() => {
      if (this.user()) {
        this.isLoading.set(false);
        this.loadNotesCount();
        this.loadRecentNote();
      } else if (!this.isLoading()) {
        this.router.navigate(['/']);
      }
    });

    // refresh trigger
    effect(() => {
      if (this.shouldRefresh()) {
        this.loadNotesCount();
        this.loadRecentNote();
      }
    });
    effect(() => {
      const s = this.summary();
      if (!s) return;

      console.log('📊 Weekly summary', s.weekly);
      console.table(s.daily.currentWeek, ['date', 'avgMood', 'count']);
    });
  }

  ngOnInit(): void {
    this.summaryService.connect();
    console.log(this.summary());

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) this.authService.checkAuthState();
    this.saveThankInLocalStorage();
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.isAuthed()) {
        this.flushFromLocal();
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    if (this.chartContainer) {
      // รอให้ DOM render เสร็จ 1 tick
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);

      // ติด ResizeObserver ด้วย เผื่อ container resize
      const ro = new ResizeObserver(() => {
        this.cdr.detectChanges();
      });
      ro.observe(this.chartContainer.nativeElement);
    }
  }
  updateNoteIsActive(id: string, newValue: boolean) {
    this.itemsNoteSearch.update((notes) =>
      notes.map((n) => (n.id === id ? { ...n, showMessage: newValue } : n))
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.summaryService.disconnect();
  }

  // --------------------------
  // 📌 Utility
  // --------------------------

  private normalizeNotes(res: entryNote[]) {
    return res
      .filter((n) => !(n as any).isDelete) // กรอง note ที่ isDelete: true ออก
      .map((n) => ({
        ...n,
        isActive: (n as any).isActive ?? (n as any).showMessage ?? false,
      }));
  }

  refreshData(): void {
    this.refreshTrigger.update((n) => n + 1);
  }

  retry(): void {
    this.retryCount.set(0);
    this.authService.checkAuthState();
  }

  saveThankInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.quickNoteFromLocalStorage.set(
        localStorage.getItem('quick-note') ?? ''
      );
    }
  }

  flushFromLocal() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('quick-note');
    if (!saved?.trim()) return;
    this.flush(saved.trim());
  }

  private flush(msg: string | undefined) {
    if (!msg) return;
    this.pending.set(true);
    this.error.set(null);
    this.apiService.createQuickNote({ thankMessage: msg }).subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('quick-note');
        }
        this.pending.set(false);
        this.toastService.showToast('เก็บคำขอบคุณอันมีค่าเรียบร้อย! :)', false);
      },
      error: () => {
        this.error.set('ส่งไม่สำเร็จ—เก็บไว้ในเครื่องแล้ว');
      },
    });
  }

  // --------------------------
  // 📌 Pagination
  // --------------------------

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    return this.itemsNoteSearch().filter((item) => {
      return (
        !term ||
        item.id.toLowerCase().includes(term) ||
        (item.line1 ?? '').toLowerCase().includes(term) ||
        (item.line2 ?? '').toLowerCase().includes(term) ||
        (item.line3 ?? '').toLowerCase().includes(term) ||
        (item.mood ?? '').toLowerCase().includes(term)
      );
    });
  });

  paginatedPosts = computed(() => {
    const all = this.filteredItems();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return all.slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredItems().length / this.itemsPerPage)
  );

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  toggleCard(index: number) {
    console.log('toggleCard called with index:', index);
    const globalIndex = (this.currentPage() - 1) * this.itemsPerPage + index;
    console.log(
      'globalIndex:',
      globalIndex,
      'current activeCard:',
      this.activeCard
    );
    this.activeCard = this.activeCard === globalIndex ? null : globalIndex;
    console.log('new activeCard:', this.activeCard);
  }

  // Helper method to check if a card is active
  isCardActive(index: number): boolean {
    const globalIndex = (this.currentPage() - 1) * this.itemsPerPage + index;
    const isActive = this.activeCard === globalIndex;
    return isActive;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.activeCard = null;
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  // --------------------------
  // 📌 Notes
  // --------------------------

  loadRecentNote(): void {
    this.apiService.getRecentNoteByUserId().subscribe({
      next: (res) => {
        const note = res as any;
        this.entry_recent_note.set({
          id: note.id ?? '',
          email: note.email ?? '',
          line1: note.line1 ?? '',
          line2: note.line2 ?? '',
          line3: note.line3 ?? '',
          imageUrls: note.imageUrls ?? [],
          mood: note.mood ?? '',
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          showMessage: note.showMessage ?? false,
        });
      },
      error: () => {
        this.entry_recent_note.set({
          id: '',
          email: '',
          line1: '',
          line2: '',
          line3: '',
          imageUrls: [],
          mood: '',
          createdAt: new Date(),
          showMessage: false,
        });
      },
    });
  }

  loadNotesCount(): void {
    this.apiService.getPositiveNotesByUserId().subscribe({
      next: (res) => this.countNote.set(res.data.countNote),
      error: () => this.countNote.set(0),
    });
  }

  closeNoteForm(): void {
    this.showNoteForm.set(false);
    this.apiService.getAllNoteByUserId().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.itemsNoteSearch.set(this.normalizeNotes(res));
          this.cdr.detectChanges();
        });
      },
    });
    this.loadRecentNote();
    this.loadNotesCount();
  }

  onNoteUpdated(updated: entryNote): void {
    let found = false;
    this.itemsNoteSearch.update((notes) =>
      notes.map((n) => {
        if (n.id === updated.id) {
          found = true;
          return {
            ...updated,
            isActive:
              (updated as any).isActive ??
              (n as any).isActive ??
              (updated as any).showMessage ??
              false,
          };
        }
        return n;
      })
    );

    if (!found) {
      this.apiService.getAllNoteByUserId().subscribe({
        next: (res) => this.itemsNoteSearch.set(this.normalizeNotes(res)),
      });
    }

    this.loadRecentNote();
    this.loadNotesCount();
    this.showNoteForm.set(false);
    this.cdr.detectChanges();
  }

  onNoteCreated(): void {
    this.apiService.getAllNoteByUserId().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.itemsNoteSearch.set(this.normalizeNotes(res));
          this.cdr.detectChanges();
        });
        this.loadNotesCount();
      },
      error: (err) =>
        console.error('Error updating notes after creation:', err),
    });
  }

  onNoteDeleted(deletedNoteId: string): void {
    console.log('Note deleted:', deletedNoteId);
    // Refresh notes list
    this.apiService.getAllNoteByUserId().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.itemsNoteSearch.set(this.normalizeNotes(res));
          this.cdr.detectChanges();
        });
        this.loadNotesCount();
      },
      error: (err) =>
        console.error('Error refreshing notes after deletion:', err),
    });
  }

  // Helper functions for dashboard
  getMoodColor(mood: number): string {
    if (mood >= 4.5) return '#11A189'; // green-500
    if (mood >= 3.5) return '#6CB9F8'; // blue-500
    if (mood >= 2.5) return '#2C2C2C'; // gray-500
    if (mood >= 1.5) return '#FF6200'; // amber-500
    return '#EF4444'; // red-500
  }

  getMoodPosition(mood: number): number {
    return Math.max(0, Math.min(100, ((mood - 1) / 4) * 100));
  }

  /** ✅ เพิ่มฟังก์ชันนี้ */
  calcTopPosition(mood: number): string {
    const moodPercent = this.getMoodPosition(mood);
    const base = 100 - moodPercent;
    const offset = 4; // ปรับ offset ให้ดอกไม้ไม่หล่น
    const safeTop = Math.min(100 - offset, Math.max(0, base));
    return `calc(${safeTop}% - 12px)`; // ลบครึ่งความสูงของ SVG (ประมาณ 12px)
  }

  getWeeklyAverageGradient(): string {
    const avg = parseFloat(this.weeklyAverage());
    if (avg < 1.5) return 'card-gradient-red';
    if (avg < 2.5) return 'card-gradient-orange';
    if (avg < 3.5) return 'card-gradient-yellow';
    if (avg < 4.5) return 'card-gradient-blue';
    return 'card-gradient-green';
  }

  getWeeklyAverageLabel(): string {
    const avg = parseFloat(this.weeklyAverage());
    if (avg < 1) return 'No notes yet. Start by creating your first one!';
    if (avg < 1.5) return 'Very Low';
    if (avg < 2.5) return 'Low';
    if (avg < 3.5) return 'Moderate';
    if (avg < 4.5) return 'Good';
    return 'Great';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');

    return `${dayName}, ${month} ${day}`;
  }

  getDefaultWeeklyData() {
    // Default data for when no real data is available
    const today = new Date();
    const data = [];

    // สร้างข้อมูลตัวอย่างที่ชัดเจนสำหรับทดสอบ
    const sampleMoods = [4.5, 3.5, 1.2, 4.8, 3.0, 2.5, 4.0]; // ตาม design ที่แสดง

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const mood = sampleMoods[i] || 3 + Math.random() * 2;
      data.push({
        date: this.formatDate(date.toISOString()),
        mood: mood,
        count: Math.floor(Math.random() * 3) + 1, // Random count 1-3
      });
    }

    return data;
  }

  getWeeklyProgressGradient(): string {
    const progress = this.weeklyProgress();
    if (progress.startsWith('-')) return 'card-gradient-red';
    return 'card-gradient-green';
  }

}
