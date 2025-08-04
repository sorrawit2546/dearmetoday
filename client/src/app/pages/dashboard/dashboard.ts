import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Api, AuthResponse, User } from '../../services/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  private authSubscription: Subscription | null = null;
  
  constructor(
    private apiService: Api,
    private router: Router,
    private authService: AuthService
  ) {}
  
  user: User | null = null;
  error: string | null = null;
  isLoading: boolean = true;
  retryCount: number = 0;
  maxRetries: number = 3;

  ngOnInit(): void {
    console.log('Dashboard: Component initialized');
    this.loadUserData();
    
    // ติดตามการเปลี่ยนแปลงของ user
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('Dashboard: User state changed:', user);
      if (user) {
        this.user = user;
        this.isLoading = false;
        this.error = null;
      } else {
        // หากไม่มี user และไม่ใช่การโหลดครั้งแรก
        if (!this.isLoading) {
          console.log('Dashboard: No user, redirecting to home');
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    console.log('Dashboard: Loading user data...');
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        console.log('Dashboard: User data loaded successfully:', response);
        this.user = response.user;
        this.isLoading = false;
        this.retryCount = 0;
      },
      error: (err) => {
        console.error('Dashboard: Error loading user data:', err);
        console.error('Dashboard: Error status:', err.status);
        console.error('Dashboard: Error message:', err.message);
        
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
          console.log(`Dashboard: Retrying... Attempt ${this.retryCount + 1}/${this.maxRetries}`);
          setTimeout(() => {
            this.loadUserData();
          }, 2000);
        } else {
          if (err.status === 401) {
            console.log('Dashboard: Unauthorized, redirecting to login...');
            this.router.navigate(['/']);
          } else {
            console.log('Dashboard: Max retries reached, showing error');
            this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
            this.isLoading = false;
          }
        }
      }
    });
  }

  retry(): void {
    console.log('Dashboard: Manual retry requested');
    this.retryCount = 0;
    this.loadUserData();
  }

  logout(): void {
    console.log('Dashboard: Logout requested');
    this.authService.logout().subscribe({
      next: () => {
        console.log('Dashboard: Logged out successfully');
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Dashboard: Error during logout:', err);
        this.router.navigate(['/']);
      }
    });
  }
}
