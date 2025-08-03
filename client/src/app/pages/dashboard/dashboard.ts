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
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    // AuthGuard ได้เช็ค token แล้ว ดังนั้นเราจะได้ข้อมูลผู้ใช้แน่นอน
    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        this.user = response.user;
        this.loading = false;
      },
      error: (err) => {
        // ถ้าเกิด error หลังจาก AuthGuard ผ่านแล้ว = ปัญหาอื่น
        this.error = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        this.loading = false;
      }
    });
  }
}
