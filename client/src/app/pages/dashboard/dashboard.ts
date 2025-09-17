import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { NoteForm } from '../../components/note-form/note-form';
import { entryNote } from '../../model/entry-note';
import { NoteCardAll } from '../../note-card-all/note-card-all';
import { NoteCardComponent } from '../../note-card/note-card';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Header } from '../../components/header/header';
import { HeroSection } from '../../components/hero-section/hero-section';
import { Footer } from '../../components/footer/footer';

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
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  // Services
  private authSubscription: Subscription | null = null;
  private authService = inject(AuthService);
  private apiService = inject(Api);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  // State signals
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

  openNoteForm(): void { this.showNoteForm.set(true); }

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
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) this.authService.checkAuthState();
    this.saveThankInLocalStorage();
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.isAuthed()) {
        this.flushFromLocal();
      }
    }, 100);
  }

  updateNoteIsActive(id: string, newValue: boolean) {
    this.itemsNoteSearch.update(notes =>
      notes.map(n =>
        n.id === id ? { ...n, isActive: newValue } : n
      )
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  // --------------------------
  // 📌 Utility
  // --------------------------

  private normalizeNotes(res: entryNote[]) {
    return res.map((n) => ({
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
    const globalIndex = (this.currentPage() - 1) * this.itemsPerPage + index;
    this.activeCard = this.activeCard === globalIndex ? null : globalIndex;
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
      error: (err) => console.error('Error updating notes after creation:', err),
    });
  }
}


