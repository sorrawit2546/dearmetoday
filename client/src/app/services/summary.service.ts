import { Injectable, signal } from '@angular/core';
import { SummaryResponse } from '../model/summary.response';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SummaryService {
  summary = signal<SummaryResponse | null>(null);
  private eventSource: EventSource | null = null;

  connect() {
    if (this.eventSource) return; // กันเปิดซ้ำ

    this.eventSource = new EventSource(
      `${environment.apiUrl}/summary/positive-mood/stream`,
      { withCredentials: true }
    );

    this.eventSource.onopen = () => {
      console.log('[SSE] connected');
    };

    this.eventSource.onmessage = (event) => {
      console.log('[SSE raw]', event.data); // 🟢 ต้องขึ้นถ้ามีข้อมูล
      const data: SummaryResponse = JSON.parse(event.data);
      this.summary.set(data);
    };

    this.eventSource.onerror = (err) => {
      console.error('[SSE error]', err);
    };
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
  }
}
