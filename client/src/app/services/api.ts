import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../model/api-data';
import { QuickNote, QuickNoteDto } from '../model/quick-note';
import { entryNote } from '../model/entry-note';

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient) {}

  // Emits when quick notes are created/updated/deleted
  quickNoteChanged$ = new Subject<void>();

  getPositiveNoteById(noteId : string){
    return this.http.get<entryNote>(`${environment.apiUrl}/positive-note/note/${noteId}`, {
      withCredentials: true,
    })
  };

  getAllQuickNote(): Observable<QuickNote[]> {
    return this.http.get<QuickNote[]>(`${environment.apiUrl}/quick-note`, {
      withCredentials: true,
    });
  }
  createQuickNote(Dto: QuickNoteDto): Observable<QuickNote> {
    return this.http
      .post<QuickNote>(`${environment.apiUrl}/quick-note`, Dto, {
        withCredentials: true,
      })
      .pipe(tap(() => this.quickNoteChanged$.next()));
  }

  getAllCommunityPost(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/positive-note/community-notes`);
  }
  getPositiveNotes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/positive-note`);
  }

  createPositiveNote(data: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/positive-note/create`, data, {
      withCredentials: true,
    });
  }

  getUserdataFromGoogle(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true,
    });
  }

  getPositiveNotesByUserId(): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/positive-note/getnote-userid`,
      {},
      { withCredentials: true }
    );
  }

  getRecentNoteByUserId(): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/positive-note/recent-note`,
      {},
      { withCredentials: true }
    );
  }

  getAllNoteByUserId(): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/positive-note/all-note`,
      {},
      { withCredentials: true }
    );
  }

  logout(): Observable<any> {
    console.log('API: Calling logout...');
    return this.http.post(
      `${environment.apiUrl}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
export type { AuthResponse };
