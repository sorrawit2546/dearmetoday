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
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  private authSubscription: Subscription | null = null;
  private authService = inject(AuthService);
  private apiService = inject(Api);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // Modern Signal-based state management
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  isAuthed = computed(() => !!this.user());
  quickNoteFromLocalStorage = signal<string>('');
  pending = signal<boolean>(false);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  retryCount = signal<number>(0);
  maxRetries = 3;
  countNote = signal<number>(0);
  itemsNoteSearch = signal<entryNote[]>([]);
  searchTerm = signal('');
  searchDate = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const date = this.searchDate().trim();

    return this.itemsNoteSearch().filter((item) => {
      const matchText =
        !term ||
        item.line1.toLowerCase().includes(term) ||
        item.line2.toLowerCase().includes(term) ||
        item.line3.toLowerCase().includes(term) ||
        item.mood?.toLowerCase().includes(term);
      return matchText;
    });
  });

  // Trigger signal สำหรับ refresh data
  private refreshTrigger = signal<number>(0);

  // Signal-based recent note
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

  // Computed values
  hasRecentNote = computed(() => {
    const note = this.entry_recent_note();
    return note.id !== '' && note.line1 !== '';
  });
  hasAllNote = computed(() => {
    const note = this.entry_all_note();
    return note.id !== '' && note.line1 !== '';
  });

  // Computed signal สำหรับ trigger refresh
  private shouldRefresh = computed(() => {
    const u = this.user();
    const trigger = this.refreshTrigger();
    return u && trigger > 0;
  });

  // Modal state
  showNoteForm = signal<boolean>(false);

  constructor(private toastService: ToastService) {
    // Modern effect with automatic cleanup
    effect(() => {
      const u = this.user();
      console.log('Effect triggered, user:', u);

      if (u) {
        this.isLoading.set(false);
        this.error.set(null);
        console.log('Loading notes for user:', u.name);
        this.loadNotesCount();
        this.loadRecentNote();
      } else if (!this.isLoading()) {
        this.router.navigate(['/']);
      }
    });

    effect(() => {
      this.apiService.getAllNoteByUserId().subscribe({
        next: (res) => this.itemsNoteSearch.set(res),
      });
    });

    // Effect ที่ใช้ computed signal สำหรับ refresh data
    effect(() => {
      const shouldRefresh = this.shouldRefresh();
      if (shouldRefresh) {
        this.loadNotesCount();
        this.loadRecentNote();
      }
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.authService.checkAuthState();
    }
    this.saveThankInLocalStorage();
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.isAuthed()) {
        this.flushFromLocal();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  notes = resource({
    loader: () => firstValueFrom(this.apiService.getAllNoteByUserId()),
  });

  saveThankInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.quickNoteFromLocalStorage.set(
        localStorage.getItem('quick-note') ?? ''
      );
    }
  }

  public flushFromLocal() {
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
      next: (res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('quick-note');
        }
        this.pending.set(false);
        this.toastService.showToast(
          'เก็บคำขอบคุณอันมีค่าเรียบร้อย! :)',
          false
        );
      },
      error: (err) => {
        // ส่งไม่สำเร็จ → ค้างไว้ใน local ให้ลองใหม่
        this.error.set('ส่งไม่สำเร็จ—เก็บไว้ในเครื่องแล้ว');
      },
    });
  }

  // Method สำหรับ refresh data
  refreshData(): void {
    this.refreshTrigger.update((trigger) => trigger + 1);
  }

  loadRecentNote(): void {
    console.log('Loading recent note...');
    this.apiService.getRecentNoteByUserId().subscribe({
      next: (response) => {
        console.log('Recent note response:', response);
        this.ngZone.run(() => {
          const note = response as Partial<entryNote> & {
            createdAt?: string | Date;
          };
          const updatedNote: entryNote = {
            id: note.id ?? '',
            email: note.email ?? '',
            line1: note.line1 ?? '',
            line2: note.line2 ?? '',
            line3: note.line3 ?? '',
            imageUrls: Array.isArray(note.imageUrls) ? note.imageUrls : [],
            mood: (note as any).mood ?? '',
            createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
            showMessage: note.showMessage ?? false,
          };

          console.log('Updated entry_recent_note:', updatedNote);
          this.entry_recent_note.set(updatedNote);
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.entry_recent_note.set({
            id: '',
            email: '',
            line1: '',
            line2: '',
            line3: '',
            imageUrls: [],
            mood: '',
            createdAt: new Date(),
            showMessage:false
          });
        });
      },
    });
  }

  loadNotesCount(): void {
    this.apiService.getPositiveNotesByUserId().subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.countNote.set(response.data.countNote);
          console.log('Notes count updated:', this.countNote());
        });
      },
      error: (err) => {
        console.error('Error loading notes count:', err);
        this.ngZone.run(() => {
          this.countNote.set(0);
        });
      },
    });
  }

  openNoteForm(): void {
    this.showNoteForm.set(true);
  }

  closeNoteForm(): void {
    this.showNoteForm.set(false);
    // Refresh data หลังจากปิด form
    this.refreshData();
  }

  onNoteCreated(): void {
    // อัปเดต notes list โดยตรงโดยไม่ refresh ทั้งหมด
    this.apiService.getAllNoteByUserId().subscribe({
      next: (res) => {
        this.itemsNoteSearch.set(res);
        this.loadNotesCount(); // อัปเดตจำนวน notes
      },
      error: (err) => {
        console.error('Error updating notes after creation:', err);
      }
    });
  }

  retry(): void {
    this.retryCount.set(0);
    this.authService.checkAuthState();
  }

}
