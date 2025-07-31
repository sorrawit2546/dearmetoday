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
  private baseUrl = 'https://your-api-endpoint.com';

  constructor(private http: HttpClient) {}

  sendNote(payload: NotePayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/notes`, payload);
  }
}
