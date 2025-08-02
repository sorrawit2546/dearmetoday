import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface NotePayload {
  email: string;
  note: string;
  mood: string;
}
@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'http://localhost:3000/api'; // หรือใช้ environment

  constructor(private http: HttpClient) {}

  // Example: GET Positive Notes
  getPositiveNotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/positive-note`);
  }

  // Example: POST new note
  createPositiveNote(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/positive-note/create`, data);
  }
}
