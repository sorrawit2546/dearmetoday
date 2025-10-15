import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  signal,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { BlogService, BlogMeta } from '../blog.service';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.html',
  imports: [MarkdownModule, CommonModule, Header, Footer, RouterModule],
})
export class BlogDetail implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private titleService = inject(Title);
  private meta = inject(Meta);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef); // ✅
  private location = inject(Location);
  private router = inject(Router);

  post: BlogMeta | null = null;
  relatedPosts: BlogMeta[] = [];
  isLoading = true;
  isMenuOpen = signal(false);
  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }
  closeMenu() {
    this.isMenuOpen.set(false);
  }

  goBack() {
    // มี history → back, ถ้าไม่มีกลับไปหน้า /blog
    if (window.history.length > 1 && document.referrer) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/blog');
    }
  }

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;

    if (isPlatformBrowser(this.platformId)) {
      this.blogService.getPost(slug).subscribe((post) => {
        this.post = post;
        this.isLoading = false;
        if (post) {
          this.titleService.setTitle(`${post.title} | Dearme,Today`);
          this.meta.updateTag({
            name: 'description',
            content: post.description,
          });

          // ✅ โหลดบทความอื่น (ยกเว้นอันปัจจุบัน)
          this.blogService.getAllPosts().subscribe((all) => {
            this.relatedPosts = all
              .filter((p) => p.slug !== post.slug)
              .slice(0, 3); // แสดง 3 บทความ
          });
        }
        this.cdr.markForCheck();
      });
    } else {
      this.isLoading = false;
    }
    if (this.post) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": this.post.title,
        "articleSection": "Productivity",
        "keywords": ["อ่านหนังสือ", "จดโน้ต", "Sticky Notes", "สรุปหนังสือ"],
        "description": "อ่านหนังสือแล้วจำไม่ได้? ลองเทคนิค Sticky Notes...",
        "mainEntityOfPage": `https://dearmetoday.com/blog/${this.post.slug}`,
        "author": { "@type": "Person", "name": "Sorrawit Sangmanee" },
        "datePublished": this.post.date,
        "image": this.post.cover,
        "publisher": {
          "@type": "Organization",
          "name": "Dearme,Today",
          "logo": {
            "@type": "ImageObject",
            "url": "https://dearmetoday.com/assets/logo.png"
          }
        }
      };

      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      this.document.head.appendChild(script);
    }
  }

  shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(fb, '_blank', 'width=600,height=400');
  }

  shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      this.post?.title || 'อ่านบทความนี้จาก Dearme,Today 🌸'
    );
    const twitter = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(twitter, '_blank', 'width=600,height=400');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('📋 คัดลอกลิงก์เรียบร้อยแล้ว!');
  }
}
