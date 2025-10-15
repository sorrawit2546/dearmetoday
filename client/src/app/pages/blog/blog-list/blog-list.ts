import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BlogService, BlogMeta } from '../blog.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.html',
  imports: [CommonModule, RouterLink, DatePipe, Header, Footer]
})
export class BlogList implements OnInit {
  private blogService = inject(BlogService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  posts: BlogMeta[] = [];
  isLoading = true;
  isMenuOpen = signal(false);
  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }
  closeMenu() {
    this.isMenuOpen.set(false);
  }
  ngOnInit() {
    // Only load posts in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      console.log('BlogList ngOnInit called in browser');
      this.blogService.getAllPosts().subscribe({
        next: (data) => {
          console.log('Blog posts received:', data);
          this.posts = data;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading blog posts:', error);
          this.posts = [];
          this.isLoading = false;
        }
      });
    } else {
      // During SSR, just set loading to false
      this.isLoading = false;
    }
  }
}
