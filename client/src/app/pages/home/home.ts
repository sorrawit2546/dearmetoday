import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HeroSection } from '../../components/hero-section/hero-section';
import { NoteFormComponent } from '../../components/note-form/note-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSection, NoteFormComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {
  // อ้างอิงถึง #noteForm ใน template
  @ViewChild('noteForm') noteFormElement!: ElementRef;

  ngAfterViewInit() {
    console.log('Home component view initialized');
    console.log('noteFormElement after view init:', this.noteFormElement);
  }

  scrollToForm() {
    console.log('scrollToForm called'); // Debug log
    console.log('noteFormElement:', this.noteFormElement); // Debug log
    
    // เพิ่ม delay เล็กน้อยเพื่อให้แน่ใจว่า DOM โหลดเสร็จแล้ว
    setTimeout(() => {
      // ตรวจสอบว่า element มีอยู่จริงก่อนเรียกใช้
      if (this.noteFormElement && this.noteFormElement.nativeElement) {
        console.log('Scrolling to form...'); // Debug log
        
        // ลองหลายวิธีในการ scroll
        try {
          // วิธีที่ 1: scrollIntoView
          this.noteFormElement.nativeElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
          
          // วิธีที่ 2: ใช้ scrollTo แบบ backup
          setTimeout(() => {
            const rect = this.noteFormElement.nativeElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - 100; // เว้นระยะ 100px จากด้านบน
            
            window.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          }, 100);
          
        } catch (error) {
          console.error('Error scrolling to form:', error);
        }
      } else {
        console.error('noteFormElement not found or nativeElement is null!');
      }
    }, 100); // รอ 100ms เพื่อให้ DOM พร้อม
  }
}
