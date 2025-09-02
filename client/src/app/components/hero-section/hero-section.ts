import {
  Component,
  inject,
  OnInit,
  resource,
  signal,
  PLATFORM_ID,
  input,
  computed,
  effect,
  afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../pages/login/login';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements OnInit {
  constructor(private router: Router, private apiService: Api) {}
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  toastError = signal<boolean>(false);
  toastMessage = signal<string | null>(null);
  quickNoteFromLocalStorage = signal<string>('');
  pending = signal<boolean>(false);
  error = signal<string | null>(null);
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  isAuthed = computed(() => !!this.user());
  navigateToGoogleProvide() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  ngOnInit() {
    this.saveThankInLocalStorage();
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && this.isAuthed()) {
        this.flushFromLocal();
      }
    }, 100);
  }

  saveThankInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.quickNoteFromLocalStorage.set(
        localStorage.getItem('quick-note') ?? ''
      );
    }
  }

  sendThankMessage() {
    const msg = this.quickNoteFromLocalStorage()?.trim();
    if (!msg) return;
    const messageToSend = msg;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('quick-note', messageToSend);
      this.showToast(
        'เก็บคำขอบคุณอันมีค่าของคุณเมื่อสักครู่ เพียงแค่ Login เข้าสู่ระบบของเรา! :)',
        false
      );
      this.quickNoteFromLocalStorage.set('');
    }
    if (this.isAuthed()) {
      console.log('Sending message:', messageToSend);
      this.flush(msg);
    }else{
      this.quickNoteFromLocalStorage.set('');
    }
  }

  private flushFromLocal() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem('quick-note');
    if (!saved?.trim()) return;
    this.flush(saved.trim());
  }

  private flush(msg: string | undefined) {
    if (!msg) return;
    this.pending.set(true);
    this.error.set(null);
    this.apiService.createQuickNote({ thankMessage: msg }).subscribe({
      next: (res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('quick-note');
        }
        this.pending.set(false);
      },
      error: (err) => {
        // ส่งไม่สำเร็จ → ค้างไว้ใน local ให้ลองใหม่
        this.error.set('ส่งไม่สำเร็จ—เก็บไว้ในเครื่องแล้ว');
      },
    });
  }

  showToast(message: string, isError = false) {
    console.log('showToast called:', message, isError);
    console.log('Before setting toastMessage:', this.toastMessage());
    this.toastMessage.set(message);
    console.log('After setting toastMessage:', this.toastMessage());
    this.toastError.set(isError);

    setTimeout(() => {
      console.log('Clearing toast');
      this.toastMessage.set(null);
    }, 3000);
  }
}
