import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

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
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: document.title,
          });
          console.log('📊 GA4 page_view tracked:', pagePath);
        }
      });
  }
}
