import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Product {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  suitableFor: string[];
  fileFormat: string;
}

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class ProductDetail {

  productId!: string;
  constructor(private route: ActivatedRoute){
    this.productId = route.snapshot.paramMap.get('id')!;
  }

  product = signal<Product>({
    id: this.productId,
    title: 'Positive Note Sheet',
    image: 'assets/images/prod-1.png',
    shortDescription:
      'แผ่นบันทึกเชิงบวกสำหรับการทบทวนตนเองในแต่ละวัน ออกแบบมาเพื่อช่วยให้คุณหยุดพักจากความเร่งรีบ และหันกลับมารับรู้คุณค่าเล็ก ๆ ที่เกิดขึ้นในชีวิตประจำวันอย่างมีระบบ',
    longDescription:
      'แผ่นบันทึกเชิงบวกสำหรับการทบทวนตนเองในแต่ละวัน ออกแบบมาเพื่อช่วยให้คุณหยุดพักจากความเร่งรีบ และหันกลับมารับรู้คุณค่าเล็ก ๆ ที่เกิดขึ้นในชีวิตประจำวันอย่างมีระบบ',
    features: [
      'ความรู้สึกของวันนี้',
      'สิ่งที่คุณรู้สึกขอบคุณ (วันละ 3 บรรทัด)',
      'เรื่องราวดี ๆ ที่เกิดขึ้น',
      'สิ่งที่คุณภูมิใจในตัวเอง',
      'พื้นที่เขียนภาพหรือความทรงจำ'
    ],
    suitableFor: [
      'ผู้ที่ต้องการฝึก Gratitude & Positive Thinking',
      'ผู้เริ่มต้นพัฒนาตัวเอง',
      'ใช้เป็นกิจวัตรยามเช้าหรือก่อนนอน',
      'ใช้พิมพ์หรือใช้งานในรูปแบบดิจิทัล'
    ],
    fileFormat: 'Digital PDF (A4)'
  });
}
