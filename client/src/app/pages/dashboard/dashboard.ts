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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NoteForm],
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

  ngOnInit(): void {
    this.loadUserData();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.ngZone.run(() => {
        if (user) {
          this.user = user;
          this.isLoading = false;
          this.error = null;
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
          console.log('Dashboard: User data loaded successfully:', response);
          this.user = response.user;
          this.isLoading = false;
          this.retryCount = 0;
          this.cdr.detectChanges(); // ✅ บังคับให้ Angular อัปเดต
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Dashboard: Error loading user data:', err);
          this.retryCount++;

          if (this.retryCount < this.maxRetries) {
            console.log(
              `Dashboard: Retrying... Attempt ${this.retryCount + 1}/${
                this.maxRetries
              }`
            );
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
