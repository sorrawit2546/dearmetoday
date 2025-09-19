import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SummaryGateway {
  // ทุกครั้งที่มี note ใหม่ จะ push event ผ่าน subject นี้
  private summaryStream = new Subject<{ userId: string }>();

  get stream$() {
    return this.summaryStream.asObservable();
  }

  notify(userId: string) {
    this.summaryStream.next({ userId });
  }
}
