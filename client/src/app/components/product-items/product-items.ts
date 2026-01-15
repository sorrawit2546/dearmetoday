import { Component, signal } from '@angular/core';
import { describe } from 'node:test';
import { Store } from '../../pages/store/store';
import { Route, Router } from '@angular/router';

interface items {
  id: string;
  image: string;
  title: string;
  describe: string;
 }

@Component({
  selector: 'app-product-items',
  imports: [],
  templateUrl: './product-items.html',
  styleUrl: './product-items.css',
})

export class ProductItems {
  constructor(private router: Router){}
  titleName = signal<items>({
    id: 'positive-note',
    image: 'assets/images/prod-1.png',
    title: 'Positive Note Sheet',
    describe: 'ไฟล์ PDF สำหรับบันทึกเชิงบวกเพื่อเพิ่มทักษะการเก็บเกี่ยวความสุขและการเห็นคุณค่าในตัวเอง...'
  })

  goToDetails(id:string) {
    this.router.navigate(['store/product', id]);
  }
}
