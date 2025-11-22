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
  OnDestroy,
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
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { BlogService, BlogMeta } from '../../pages/blog/blog.service';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, FormsModule, CommonModule, ToastComponent],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private apiService: Api,
    private toastService: ToastService,
    private blogService: BlogService
  ) {}
  ngOnDestroy(): void {
    this.noteCountSub?.unsubscribe();
  }
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private noteCountSub?: Subscription;
  quickNoteFromLocalStorage = signal<string>('');
  pending = signal<boolean>(false);
  error = signal<string | null>(null);
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  isAuthed = computed(() => !!this.user());
  noteCount = signal<number>(0);
  latestPosts = signal<BlogMeta[]>([]);
  navigateToGoogleProvide() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  ngOnInit() {
    this.saveThankInLocalStorage();
    // setTimeout(() => {
    //   if (isPlatformBrowser(this.platformId) && this.isAuthed()) {
    //     this.flushFromLocal();
    //   }
    // }, 100);
    this.noteCountSub = this.apiService.getAllPositiveNoteCountStream().subscribe({
      next: (count) => this.noteCount.set(count),
      error: (err) => console.error('SSE error', err),
    });

    // Load latest 3 blog posts
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        const latest = (posts ?? []).slice(0, 3);
        this.latestPosts.set(latest);
      },
      error: (err) => {
        console.error('Failed to load blog posts', err);
      },
    });
  }

  saveThankInLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.quickNoteFromLocalStorage.set(
        localStorage.getItem('quick-note') ?? ''
      );
    }
  }

  sendThankMessage(current?: string) {
    const msg = (current ?? this.quickNoteFromLocalStorage())?.trim();
    if (!msg) return;
    const messageToSend = msg;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('quick-note', messageToSend);
      this.toastService.showToast(
        'เก็บคำขอบคุณอันมีค่าของคุณเมื่อสักครู่ เพียงแค่ Login เข้าสู่ระบบของเรา! :)',
        false
      );
      if (!this.isAuthed()) {
        this.quickNoteFromLocalStorage.set('');
      }
    }
    if (this.isAuthed()) {
      console.log('Sending message:', messageToSend);
      this.flush(msg);
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
        this.quickNoteFromLocalStorage.set('');
        this.pending.set(false);
      },
      error: (err) => {
        // ส่งไม่สำเร็จ → ค้างไว้ใน local ให้ลองใหม่
        this.error.set('ส่งไม่สำเร็จ—เก็บไว้ในเครื่องแล้ว');
      },
    });
  }

}
