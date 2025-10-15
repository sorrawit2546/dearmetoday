import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: Function; // ← ใช้ฟังก์ชันจาก gtag.js ที่โหลดใน index.html

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Dearme,Today';
  private router = inject(Router);

  ngOnInit() {
    // ✅ ติดตามทุกครั้งที่เปลี่ยน route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const pagePath = event.urlAfterRedirects;

        // ส่งข้อมูล page_view ไป GA4
        gtag('event', 'page_view', {
          page_path: pagePath,
          page_title: document.title,
        });

        // (ถ้าอยาก log ใน console ด้วย)
        console.log('📊 GA4 page_view tracked:', pagePath);
      });
  }
}
