import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-form',
  standalone: true,
  // อย่าลืม import ReactiveFormsModule และ CommonModule
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  noteForm!: FormGroup;
  currentDate = new Date();
  selectedImages: string[] = [];
  selectedFiles: File[] = [];
  toastMessage: string = '';
  showToastFlag: boolean = false;
  
  // สร้าง Array ของ Moods เพื่อใช้ใน *ngFor
  moods = [
    { value: 'happy', emoji: '😊', text: 'Happy', shortText: 'Happy' },
    { value: 'excited', emoji: '🤩', text: 'Excited', shortText: 'Excited' },
    { value: 'calm', emoji: '😌', text: 'Calm', shortText: 'Calm' },
    { value: 'grateful', emoji: '🙏', text: 'Grateful', shortText: 'Grateful' },
    { value: 'motivated', emoji: '💪', text: 'Motivated', shortText: 'Motivated' }
  ];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // สร้าง FormGroup และกำหนด FormControl พร้อม Validation
    this.noteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      positiveNote: ['', Validators.required],
      mood: ['happy', Validators.required]
    });
  }

  async onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    
    for (const file of files) {
      // ตรวจสอบจำนวนรูปสูงสุด (5 รูป)
      if (this.selectedFiles.length >= 5) {
        alert('สามารถเลือกรูปได้สูงสุด 5 รูป');
        break;
      }

      // ตรวจสอบขนาดไฟล์ (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} ใหญ่เกินไป (สูงสุด 10MB)`);
        continue;
      }

      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
        continue;
      }

      try {
        // เพิ่มไฟล์ก่อนเพื่อให้ UI รู้ว่ามีการเปลี่ยนแปลง
        this.selectedFiles.push(file);
        this.selectedImages.push(''); // placeholder เพื่อให้ length ตรงกัน
        
        // บังคับให้ Angular อัพเดท UI
        this.cdr.detectChanges();
        
        // แปลงไฟล์เป็น base64 โดยใช้ Promise
        const imageDataUrl = await this.readFileAsDataUrl(file);
        
        // อัพเดทรูปจริง
        const index = this.selectedFiles.indexOf(file);
        if (index !== -1) {
          this.selectedImages[index] = imageDataUrl;
          this.cdr.detectChanges(); // บังคับอัพเดท UI อีกครั้ง
          console.log('Image loaded at index:', index, 'total images:', this.selectedImages.length);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        // ลบ placeholder ออกถ้าโหลดไม่สำเร็จ
        const index = this.selectedFiles.indexOf(file);
        if (index !== -1) {
          this.selectedFiles.splice(index, 1);
          this.selectedImages.splice(index, 1);
          this.cdr.detectChanges();
        }
        alert(`ไม่สามารถโหลดไฟล์ ${file.name} ได้`);
      }
    }

    // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
    event.target.value = '';
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // เมธอดสำหรับทริกเกอร์ file input
  triggerFileInput() {
    if (this.selectedImages.length < 5) {
      this.fileInput.nativeElement.click();
    }
  }

  // Track function สำหรับ ngFor เพื่อประสิทธิภาพ
  trackByIndex(index: number, item: any): number {
    return index;
  }

  removeImage(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    
    // ลบรูปโดยไม่ต้องยืนยัน (สำหรับ UX ที่ดีขึ้น)
    this.selectedImages.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.cdr.detectChanges();
    console.log('Image removed. Remaining:', this.selectedImages.length);
    
    // แสดงข้อความแจ้งเตือนสั้น ๆ
    this.showToast(`ลบรูปที่ ${index + 1} แล้ว`);
  }

  // Method สำหรับ context menu (ไว้ขยายในอนาคต)
  showImageMenu(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    // สำหรับขณะนี้ให้ลบรูปเลย
    this.removeImage(event, index);
  }

  // Method สำหรับลบรูปทั้งหมด
  clearAllImages() {
    if (this.selectedImages.length > 0) {
      const imageCount = this.selectedImages.length;
      if (confirm(`ต้องการลบรูปทั้งหมด ${imageCount} รูป หรือไม่?`)) {
        this.selectedImages = [];
        this.selectedFiles = [];
        this.cdr.detectChanges();
        console.log('All images cleared');
        this.showToast(`ลบรูปทั้งหมด ${imageCount} รูปแล้ว`);
      }
    }
  }

  // Debug methods
  onImageLoad(index: number) {
    console.log('Image loaded in template:', index);
  }

  onImageError(index: number) {
    console.log('Image error in template:', index);
    // แสดงรูป placeholder หรือข้อความ error
    this.showToast(`ไม่สามารถโหลดรูปที่ ${index + 1} ได้`, 'error');
  }

  // Toast notification system
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.showToastFlag = true;
    this.cdr.detectChanges();
    
    // ซ่อน toast หลัง 2 วินาที
    setTimeout(() => {
      this.showToastFlag = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  // Methods สำหรับ Mood
  getMoodEmoji(): string {
    const currentMood = this.noteForm.get('mood')?.value;
    const mood = this.moods.find(m => m.value === currentMood);
    return mood ? mood.emoji : '😊';
  }

  getMoodText(): string {
    const currentMood = this.noteForm.get('mood')?.value;
    const mood = this.moods.find(m => m.value === currentMood);
    return mood ? mood.text : 'Happy';
  }

  onSubmit() {
    if (this.noteForm.valid) {
      // รวมข้อมูลฟอร์มและไฟล์รูปภาพ
      const formData = {
        ...this.noteForm.value,
        hasImages: this.selectedFiles.length > 0,
        imageFiles: this.selectedFiles,
        imageCount: this.selectedFiles.length
      };
      
      console.log('Form Submitted!', formData);
      
      // แสดงข้อความสำเร็จ
      const imageText = this.selectedFiles.length > 0 
        ? ` พร้อมรูปภาพ ${this.selectedFiles.length} รูป` 
        : '';
      alert(`บันทึกข้อความเรียบร้อยแล้ว${imageText}! 🎉`);
      
      // รีเซ็ตฟอร์ม
      this.noteForm.reset({
        mood: 'happy' // ค่าเริ่มต้น
      });
      this.selectedImages = [];
      this.selectedFiles = [];
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }
}