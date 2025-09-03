import { CommonModule } from '@angular/common';
import { Component, effect, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { QuickNote } from '../../model/quick-note';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiService = inject(Api);
  private refreshIntervalId: any;
  private previousQuickNoteCount = 0;
  private hasInitializedQuickNotes = false;
  private quickNoteChangeSub?: any;

  quickNoteMessage = signal<QuickNote[]>([]);
  unreadQuickNotes = signal<boolean>(false);

  quickNote = resource<QuickNote[], Error>({
    loader: async () => {
      const data = await firstValueFrom(this.apiService.getAllQuickNote());
      this.quickNoteMessage.set(data);

      if (!this.hasInitializedQuickNotes) {
        this.previousQuickNoteCount = data.length;
        this.hasInitializedQuickNotes = true;
        this.unreadQuickNotes.set(false);
      } else {
        if (data.length > this.previousQuickNoteCount) {
          this.unreadQuickNotes.set(true);
        }
        this.previousQuickNoteCount = data.length;
      }

      return data;
    },
  });

  constructor() {
    effect(() => {
      if (this.quickNote.isLoading()) {
        console.log('Quick Note is loading!');
        return;
      }
      const data = this.quickNote.value();
      console.log(data);
    });

    // Reload immediately when quick notes mutate
    this.quickNoteChangeSub = this.apiService.quickNoteChanged$.subscribe(
      () => {
        this.quickNote.reload();
      }
    );

    this.refreshIntervalId = setInterval(() => {
      this.quickNote.reload();
    }, 20000);
  }

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

  markQuickNotesRead(): void {
    this.previousQuickNoteCount = this.quickNoteMessage().length;
    this.unreadQuickNotes.set(false);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    if (this.quickNoteChangeSub) {
      this.quickNoteChangeSub.unsubscribe?.();
    }
  }
}
