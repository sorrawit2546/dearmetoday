import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up.html',
  styleUrls: ['./pop-up.css'],
})
export class PopUp implements OnInit {
  showPopup = false;
  currentSlide = 0;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // แสดงเฉพาะครั้งแรกหลังจากผู้ใช้ login ในหนึ่ง session เท่านั้น
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        const key = `onboarding_shown_session_${user.email}`;
        const hasShownThisSession = sessionStorage.getItem(key);
        // แสดง popup หากยังไม่เคยปิดใน session นี้ (อย่าเพิ่งเขียน flag ที่นี่)
        this.showPopup = !hasShownThisSession;
      } else {
        this.showPopup = false;
      }
    });
  }

  closePopup() {
    // เขียน flag เมื่อผู้ใช้กดปิดจริง ๆ เพื่อลดโอกาส flicker จากการ emit ซ้ำของ currentUser$
    const user = this.authService.getCurrentUser();
    if (user) {
      const key = `onboarding_shown_session_${user.email}`;
      sessionStorage.setItem(key, 'true');
    }
    this.showPopup = false;
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  slides = [
    {
      image: 'assets/popup/1.png',
      title: 'เริ่มต้น Note แรกของคุณ ✨',
      description: 'เขียนบันทึก 3 บรรทัดสั้น ๆ เพื่อขอบคุณสิ่งดี ๆ ในวันนี้ 🌱',
    },
    {
      image: 'assets/popup/2.png',
      title: 'ติดตามอารมณ์ของคุณ',
      description: 'ระบบจะสร้างกราฟ Daily Mood Flow ให้ดูภาพรวมทั้งสัปดาห์ 💚',
    },
    {
      image: 'assets/popup/3.png',
      title: 'ดูสรุปใน Overview',
      description:
        'ดูสถิติความรู้สึก, จำนวน Note และพัฒนาการในหน้า Overview 📈',
    },
    {
      image: 'assets/popup/4.png',
      title: 'Community',
      description:
        'แบ่งปันเรื่องราวดี ๆ สู่ Community เพื่อรับและส่งต่อแรงบันดาลใจให้แก่กัน 🤍',
    },
    {
      image: 'assets/popup/5.png',
      title: 'Collection!',
      description: 'สะสม Stamp แต่ละวันตาม Mood เพื่อเก็บเป็นความทรงจำในระยะยาว :)',
    },
    {
      image: 'assets/popup/6.png',
      title: 'Send Note To Email!',
      description: 'ส่งข้อความพร้อมรูปของคุณไปเก็บไว้ใน Email 💌',
    },
  ];
}
