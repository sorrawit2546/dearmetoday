import { Component, effect, inject, resource } from '@angular/core';
import { Header } from '../../components/header/header';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CommunityPost } from '../../model/community-note';
import { NoteCardAll } from '../../note-card-all/note-card-all';

@Component({
  selector: 'app-community',
  imports: [Header, CommonModule, NoteCardAll],
  templateUrl: './community.html',
  styleUrl: './community.css'
})
export class Community {
  private authService = inject(AuthService);
  private apiService = inject(Api)
  user = toSignal(this.authService.currentUser$, { initialValue: null });
  activeCard: number | null = null;

  toggleCard(index: number) {
    this.activeCard = this.activeCard === index ? null : index;
  }
  readonly communityPost = resource<CommunityPost[], void>({
    loader: async () => firstValueFrom(this.apiService.getAllCommunityPost())
  });

  constructor() {
    effect(() => {
      if (this.communityPost.isLoading()) {
        console.log('communityPost: loading...');
        return;
      }
      const data = this.communityPost.value();
      console.log(data)
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
    this.authService.checkAuthState();
  }
}
