import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Api, AuthResponse, User } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { NoteForm } from '../../components/note-form/note-form';
import { NoteCardComponent } from '../../note-card/note-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NoteForm, NoteCardComponent],
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
      }
    });
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
