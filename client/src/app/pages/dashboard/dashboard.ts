import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NoteForm } from '../../components/note-form/note-form';
import { entryNote } from '../../model/entry-note';
import { NoteCardComponent } from '../../note-card/note-card';
import { Api, AuthResponse, User } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { NoteCardAll } from '../../note-card-all/note-card-all';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NoteForm, NoteCardComponent, NoteCardAll],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'], // ✅ แก้จาก styleUrl เป็น styleUrls
})
export class Dashboard implements OnInit, OnDestroy {
  private authSubscription: Subscription | null = null;

  constructor(
    private apiService: Api,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone, // ✅ เพิ่ม
    private cdr: ChangeDetectorRef // ✅ เพิ่ม
  ) {}

  user: User | null = null;
  error: string | null = null;
  isLoading: boolean = true;
  retryCount: number = 0;
  maxRetries: number = 3;
  countNote: number = 0;
  entry_recent_note: entryNote = {
    id: '',
    email: '',
    line1: '',
    imageUrls: [],
    mood: '',
    createdAt: new Date(),
  };

  // Modal state for note form
  showNoteForm = false;

  ngOnInit(): void {
    this.loadUserData();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.ngZone.run(() => {
        if (user) {
          this.user = user;
          this.isLoading = false;
          this.error = null;
          // เรียก API หลังจากที่ user login แล้ว
          this.loadNotesCount();
          this.loadRecentNote();
        } else if (!this.isLoading) {
          this.router.navigate(['/']);
        }
        this.cdr.detectChanges(); // ✅ บังคับให้ Angular อัปเดต
      });
    });
  }

  

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        this.ngZone.run(() => {
          this.user = response.user;
          this.isLoading = false;
          this.retryCount = 0;
          this.cdr.detectChanges(); // ✅ บังคับให้ Angular อัปเดต
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.retryCount++;

          if (this.retryCount < this.maxRetries) {
            setTimeout(() => this.loadUserData(), 2000);
          } else {
            if (err.status === 401) {
              this.router.navigate(['/']);
            } else {
              this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
              this.isLoading = false;
              this.cdr.detectChanges(); // ✅ บังคับให้ Angular อัปเดต
            }
          }
        });
      },
    });
  }

  retry(): void {
    this.retryCount = 0;
    this.loadUserData();
  }

  loadRecentNote(): void {
    this.apiService.getRecentNoteByUserId().subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          const note = response as Partial<entryNote> & {
            createdAt?: string | Date;
          };
          this.entry_recent_note = {
            id: note.id ?? '',
            email: note.email ?? '',
            line1: note.line1 ?? '',
            imageUrls: Array.isArray(note.imageUrls) ? note.imageUrls : [],
            mood: (note as any).mood ?? '',
            createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          };
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          // คงค่าเริ่มต้นไว้เมื่อโหลดไม่สำเร็จ
          this.entry_recent_note = {
            id: '',
            email: '',
            line1: '',
            imageUrls: [],
            mood: '',
            createdAt: new Date(),
          };
          this.cdr.detectChanges();
        });
      },
    });
  }

  loadNotesCount(): void {
    this.apiService.getPositiveNotesByUserId().subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          this.countNote = response.data.countNote;
          console.log('Notes count updated:', this.countNote);
          this.cdr.detectChanges(); // บังคับอัปเดต view
        });
      },
      error: (err) => {
        console.error('Error loading notes count:', err);
        this.ngZone.run(() => {
          this.countNote = 0;
          this.cdr.detectChanges();
        });
      },
    });
  }

  openNoteForm(): void {
    this.showNoteForm = true;
    this.cdr.detectChanges();
  }

  closeNoteForm(): void {
    this.showNoteForm = false;
    this.cdr.detectChanges();
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
