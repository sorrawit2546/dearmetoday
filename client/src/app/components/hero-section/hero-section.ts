import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {
  // ใช้ EventEmitter เพื่อส่ง event ไปให้ parent component
  @Output() showFormEvent = new EventEmitter<void>();

  handleShowForm() {
    console.log('handleShowForm called'); // Debug log
    // ส่ง event ไปให้ parent component (Home) จัดการ scroll
    this.showFormEvent.emit();
  }
}
