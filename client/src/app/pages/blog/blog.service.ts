import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, catchError } from 'rxjs';
import * as yaml from 'js-yaml';

export interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  cover?: string;
  content?: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private http: HttpClient) {}

  private parseFrontMatter(markdown: string): BlogMeta {
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
    let metadata: Partial<BlogMeta> = {};
    let content = markdown;

    if (match) {
      const yamlText = match[1];
      metadata = yaml.load(yamlText) as BlogMeta;
      content = markdown.replace(match[0], '').trim();
    }


    return { ...(metadata as BlogMeta), content };
  }

  getAllPosts(): Observable<BlogMeta[]> {
    return this.http.get<{ files: string[] }>('assets/blogs/index.json').pipe(
      switchMap((index) => {
        console.log('📄 index.json loaded:', index);
  
        const requests = index.files.map((f) => {
          console.log('🔹 fetching markdown:', f);
          return this.http.get(`assets/blogs/${f}`, { responseType: 'text' });
        });
  
        return forkJoin(requests).pipe(
          map((responses) => {
            console.log('✅ markdown responses:', responses);
            const parsed = responses.map((md) => this.parseFrontMatter(md));
            console.log('📚 parsed posts:', parsed);
            return parsed.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          })
        );
      }),
      catchError((err) => {
        console.error('❌ Error in getAllPosts:', err);
        return [];
      })
    );
  }
  

  getPost(slug: string): Observable<BlogMeta | null> {
    return this.getAllPosts().pipe(
      map((posts) => posts.find((p) => p.slug === slug) ?? null)
    );
  }
}
