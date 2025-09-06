import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Api, AuthResponse } from '../../services/api';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-form.html',
  styleUrls: ['./note-form.css'],
})
export class NoteForm {
  @ViewChild('confirmDialog') confirmDialog!: ElementRef<HTMLDialogElement>;
  @Output() noteCreated = new EventEmitter<void>();

  isLoading = false;
  previewImages: string[] = [];
  isDragging = false;
  email = '';
  note = '';
  note2= '';
  note3= '';
  mood = 'happy';
  formattedDate: string = '';
  showMessage = false;

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private apiService: Api,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }); // เช่น "28 July 2025"
    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        this.ngZone.run(() => {
          console.log('Dashboard: User data loaded successfully:', response);
          this.email = response.user.email;
          console.log(this.email);
          this.isLoading = false;
          this.cdr.detectChanges(); // ✅ บังคับให้ Angular อัปเดต
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Dashboard: Error loading user data:', err);
        });
      },
    });
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    this.handleFiles(files);

    input.value = '';
  }

  handleFiles(files: File[]): void {
    const remainingSlots = 5 - this.previewImages.length;
    const validFiles = files.slice(0, remainingSlots);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.ngZone.run(() => {
          // immutable update เพื่อ Angular detect change
          this.previewImages = [...this.previewImages, reader.result as string];
          this.cd.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.previewImages = this.previewImages.filter((_, i) => i !== index);
    this.cd.detectChanges();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  submitForm() {
    this.confirmDialog.nativeElement.showModal(); // เปิด dialog
  }
  cancelSend() {
    this.confirmDialog.nativeElement.close();
  }

  confirmSend() {
    console.log('Starting form submission...');
    this.isLoading = true;
    console.log('isLoading set to:', this.isLoading);
    this.cd.detectChanges(); // Force change detection

    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('line1', this.note);
    formData.append('line2', this.note2);
    formData.append('line3', this.note3);
    formData.append('mood', this.mood);
    formData.append('showMessage', this.showMessage ? 'true' : 'false');

    this.previewImages.forEach((imageDataUrl, index) => {
      const byteString = atob(imageDataUrl.split(',')[1]);
      const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append('imageUrls', blob, `image${index}.jpg`);
    });

    this.apiService
      .createPositiveNote(formData)
      .pipe(
        finalize(() => {
          console.log('Request finalized');
          this.ngZone.run(() => {
            this.isLoading = false;
            console.log('isLoading set to:', this.isLoading);
            this.cd.detectChanges();
          });
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Success:', response);
          console.log('Current mood:', this.mood);
          this.resetForm();

          // แจ้ง dashboard ว่า note ถูกสร้างสำเร็จแล้ว
          this.noteCreated.emit();

          if (this.mood === 'happy') {
            this.toastService.showToast(
              'ดีใจด้วยนะ! ลองเก็บสิ่งดีๆ นี้ไว้ใช้ในวันที่รู้สึกเหนื่อยนะ :)',
              false
            );
          }
          if (this.mood === 'calm') {
            this.toastService.showToast(
              'วันที่สงบ มักจะมากับความสบายใจ!',
              false
            );
          }
          if (this.mood === 'tired') {
            this.toastService.showToast(
              'สายลมเปลี่ยนแปลงเสมอ อย่าลืมไปหาของอร่อย ๆ กินนะ!',
              false
            );
          }
          if (this.mood === 'sad') {
            this.toastService.showToast(
              'แม้วันนี้จะไม่ง่าย แต่คุณยังเห็นแสงเล็กๆ อยู่ เก่งมากเลยนะ',
              false
            );
          }
          if (this.mood === 'neutral') {
            this.toastService.showToast(
              'บางวันก็กลางๆ แบบนี้แหละ แต่คุณก็ยังเขียนถึงสิ่งดีๆ ได้ เยี่ยมเลย!',
              false
            );
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastService.showToast('Failed to send magic message!', true);
        },
      });
  }

  private resetForm(): void {
    this.email = '';
    this.note = '';
    this.note2 = '';
    this.note3 = '';
    // this.mood = ''; // ไม่ reset mood เพื่อให้ toast ทำงานได้
    this.previewImages = [];
  }

}
