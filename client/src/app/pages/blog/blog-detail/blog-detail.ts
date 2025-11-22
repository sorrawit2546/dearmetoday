import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  signal,
  Inject,
  ViewChild,
  ElementRef,
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

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

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
  toc: { id: string; text: string; level: number }[] = [];
  @ViewChild('content', { static: false }) contentRef?: ElementRef<HTMLDivElement>;
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

    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }

      this.blogService.getPost(slug).subscribe((post) => {
      this.post = post;
      this.isLoading = false;

      if (!post) {
        this.cdr.markForCheck();
        return;
      }

      // ✅ ตั้ง Title + Meta
      this.titleService.setTitle(`${post.title} | Dearme,Today`);
      this.meta.updateTag({ name: 'description', content: post.description });

      // ✅ โหลดบทความอื่น
      this.blogService.getAllPosts().subscribe((all) => {
        this.relatedPosts = all.filter((p) => p.slug !== post.slug).slice(0, 3);
      });

       // ✅ ยิง Event GA4 เพื่อ track ผู้อ่านรายบทความ
       if (typeof window !== 'undefined' && window.gtag) {
         window.gtag('event', 'view_blog_post', {
           post_slug: slug,
           post_title: post.title,
           page_path: `/blog/${slug}`,
           page_title: post.title,
         });
         console.log('📊 GA4: view_blog_post sent for', slug);
       }

      // ✅ เพิ่ม Schema.org Article (E-E-A-T)
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "articleSection": "Productivity",
        "keywords": ["อ่านหนังสือ", "จดโน้ต", "Sticky Notes", "สรุปหนังสือ"],
        "description": post.description,
        "mainEntityOfPage": `https://dearmetoday.com/blog/${post.slug}`,
        "author": { "@type": "Person", "name": "Sorrawit Sangmanee" },
        "datePublished": post.date,
        "image": post.cover || "https://dearmetoday.com/assets/logo.png",
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

       // สร้าง TOC หลังจากเนื้อหาถูก render แล้วเล็กน้อย
       setTimeout(() => this.buildToc(), 0);
       this.cdr.markForCheck();
    });
  }


  shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(fb, '_blank', 'width=600,height=400');
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  buildToc() {
    if (!this.contentRef) return;
    const root = this.contentRef.nativeElement;
    const headings = Array.from(root.querySelectorAll('h1, h2, h3')) as HTMLHeadingElement[];
    const usedIds = new Set<string>();
    this.toc = headings.map((h) => {
      const baseId = this.slugify(h.textContent || '');
      let id = baseId || 'section';
      let suffix = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${suffix++}`;
      }
      usedIds.add(id);
      h.id = id;
      const level = h.tagName === 'H1' ? 1 : h.tagName === 'H2' ? 2 : 3;
      return { id, text: h.textContent || '', level };
    });
  }

  scrollTo(id: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // อัปเดต fragment ใน URL (optional)
      history.replaceState(null, '', `#${id}`);
    }
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
