import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { CommunityPost } from '../../model/community-note';
import { NoteCardAll } from '../../note-card-all/note-card-all';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-community',
  imports: [Header, CommonModule, NoteCardAll, Footer],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class Community {
  private authService = inject(AuthService);
  private apiService = inject(Api);
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  activeCard: number | null = null;

  // Pagination properties
  currentPage = signal(1);
  itemsPerPage = 3;

  toggleCard(index: number) {
    // Convert paginated index to global index
    const globalIndex = (this.currentPage() - 1) * this.itemsPerPage + index;
    this.activeCard = this.activeCard === globalIndex ? null : globalIndex;
  }

  readonly communityPost = resource<CommunityPost[], void>({
    loader: async () => firstValueFrom(this.apiService.getAllCommunityPost()),
  });

  paginatedPosts = computed(() => {
    const allPosts = this.communityPost.value() || [];
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return allPosts.slice(startIndex, endIndex);
  });

  totalPages = computed(() => {
    const allPosts = this.communityPost.value() || [];
    return Math.ceil(allPosts.length / this.itemsPerPage);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.activeCard = null; // Reset active card when changing pages
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Show up to 5 page numbers
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Helper method to check if a card is active
  isCardActive(index: number): boolean {
    const globalIndex = (this.currentPage() - 1) * this.itemsPerPage + index;
    return this.activeCard === globalIndex;
  }

  constructor() {
    effect(() => {
      if (this.communityPost.isLoading()) {
        console.log('communityPost: loading...');
        return;
      }
      const data = this.communityPost.value();
      console.log(data);
    });
    // Modern effect with automatic cleanup
    effect(() => {
      const u = this.user();
      console.log('Effect triggered, user:', u);

      if (u) {
        console.log('Loading notes for user:', u.name);
      }
    });
  }

  ngOnInit(): void {
    // this.authService.checkAuthState();
  }

  updateNoteIsActive(id: string, newValue: boolean): void {
    // ในหน้า community ไม่ต้องอัปเดต local state เพราะเป็น read-only
    console.log('Note showMessage updated:', id, newValue);
  }
}
