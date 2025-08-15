import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotePayload {
  email: string;
  note: string;
  mood: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) {}

  // Example: GET Positive Notes
  getPositiveNotes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/positive-note`);
  }

  // Example: POST new note
  createPositiveNote(data: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/positive-note/create`, data);
  }

  getUserdataFromGoogle(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    });
  }

  getPositiveNotesByUserId(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/positive-note/getnote-userid`, {}, { withCredentials: true });
  }

  getRecentNoteByUserId(): Observable<any>{
    return this.http.post(`${environment.apiUrl}/positive-note/recent-note`, {}, { withCredentials: true })
  }


  logout(): Observable<any> {
    console.log('API: Calling logout...');
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    });
  }
}
