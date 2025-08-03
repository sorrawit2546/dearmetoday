import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, AuthResponse, User } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(
    private apiService: Api
  ) {}
  
  user: User | null = null;
  error: string | null = null;
  isLoading: boolean = true;
  retryCount: number = 0;
  maxRetries: number = 3;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        console.log('User data loaded:', response);
        this.user = response.user;
        this.isLoading = false;
        this.retryCount = 0; // รีเซ็ต retry count เมื่อสำเร็จ
      },
      error: (err) => {
        console.error('Error loading user data:', err);
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
          // ลองใหม่หลังจาก 2 วินาที
          setTimeout(() => {
            console.log(`Retrying... Attempt ${this.retryCount + 1}/${this.maxRetries}`);
            this.loadUserData();
          }, 2000);
        } else {
          this.error = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
          this.isLoading = false;
        }
      }
    });
  }

  retry(): void {
    this.retryCount = 0;
    this.loadUserData();
  }
}
