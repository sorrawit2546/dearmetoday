import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NoteForm, NoteCardComponent, NoteCardAll],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  private authSubscription: Subscription | null = null;
  private authService = inject(AuthService);
  private apiService = inject(Api);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // Modern Signal-based state management
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  error = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  retryCount = signal<number>(0);
  maxRetries = 3;
  countNote = signal<number>(0);

  // Trigger signal สำหรับ refresh data
  private refreshTrigger = signal<number>(0);

  // Signal-based recent note
  entry_recent_note = signal<entryNote>({
    id: '',
    email: '',
    line1: '',
    imageUrls: [],
    mood: '',
    createdAt: new Date(),
  });

  entry_all_note = signal<entryNote>({
    id: '',
    email: '',
    line1: '',
    imageUrls: [],
    mood: '',
    createdAt: new Date(),
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

  constructor() {
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

    // Effect ที่ใช้ computed signal สำหรับ refresh data
    effect(() => {
      const shouldRefresh = this.shouldRefresh();

      if (shouldRefresh) {
        console.log('Refreshing data via computed signal');
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

    // Debug: ดูว่า notes resource ได้ข้อมูลอะไร
    console.log('Notes resource:', this.notes);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  notes = resource({
    loader: () => firstValueFrom(this.apiService.getAllNoteByUserId()),
  });

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
            imageUrls: Array.isArray(note.imageUrls) ? note.imageUrls : [],
            mood: (note as any).mood ?? '',
            createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
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
            imageUrls: [],
            mood: '',
            createdAt: new Date(),
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
    console.log('Note created successfully, refreshing data...');
    // Refresh data เมื่อ note ถูกสร้างสำเร็จ
    this.refreshData();
  }

  retry(): void {
    this.retryCount.set(0);
    this.authService.checkAuthState();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.router.navigate(['/']);
      },
    });
  }
}
