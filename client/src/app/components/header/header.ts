import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

   // สร้าง signal user ขึ้นมา
  user = toSignal(this.authService.currentUser$, { initialValue: null });
   
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
