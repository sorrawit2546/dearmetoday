import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Api, AuthResponse } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { entryNote } from '../../model/entry-note';
type PreviewImage = {
  src: string;       // URL หรือ base64 dataURL
  isNew: boolean;    // true = อัปโหลดใหม่, false = มีอยู่แล้วในระบบ
};

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-form.html',
  styleUrls: ['./note-form.css'],
})
export class NoteForm implements OnChanges {
  @ViewChild('confirmDialog') confirmDialog!: ElementRef<HTMLDialogElement>;
  @Output() noteCreated = new EventEmitter<void>();

  @Input() noteId!: string;
  isEditMode = false;

  noteById: entryNote | null = null;

  isLoading = false;
  previewImages: PreviewImage[] = [];
  isDragging = false;
  email = '';
  note = '';
  note2 = '';
  note3 = '';
  mood = 'happy';
  createdAt = '';
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
    if (this.noteId) {
      this.loadNoteData();
    }
    this.isEditMode = !!this.noteId;
    if (this.isEditMode) {
      this.loadNoteData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['noteId']?.currentValue &&
      changes['noteId'].currentValue !== changes['noteId'].previousValue
    ) {
      console.log('NoteForm received id:', this.noteId);
      this.loadNoteData();
    }
  }

  loadNoteData() {
    this.isLoading = true;
    this.apiService.getPositiveNoteById(this.noteId).subscribe({
      next: (data: entryNote) => {
        this.ngZone.run(() => {
          // ✅ ต้อง set ค่าฟอร์มทั้งหมดด้วยของจาก server
          this.email = data.email;
          this.note  = data.line1 ?? '';
          this.note2 = data.line2 ?? '';
          this.note3 = data.line3 ?? '';
          this.mood  = data.mood;
          this.previewImages = data.imageUrls.map(url => ({ src: url, isNew: false }));
          this.createdAt = new Date(data.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
          });

          this.cd.detectChanges();
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
          this.previewImages = [
            ...this.previewImages,
            { src: reader.result as string, isNew: true }
          ];
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
    this.confirmDialog.nativeElement.showModal();
  }
  cancelSend() {
    this.confirmDialog.nativeElement.close();
  }

  showMoodToast(mood: string, isEdit: boolean = false) {
    if (isEdit) {
      this.toastService.showToast('แก้ไขบันทึกสำเร็จแล้ว!', false);
      return;
    }

    const messages: Record<string, string> = {
      happy: 'ดีใจด้วยนะ! ลองเก็บสิ่งดีๆ นี้ไว้ใช้ในวันที่รู้สึกเหนื่อยนะ :)',
      calm: 'วันที่สงบ มักจะมากับความสบายใจ!',
      tired: 'สายลมเปลี่ยนแปลงเสมอ อย่าลืมไปหาของอร่อย ๆ กินนะ!',
      sad: 'แม้วันนี้จะไม่ง่าย แต่คุณยังเห็นแสงเล็กๆ อยู่ เก่งมากเลยนะ',
      neutral:
        'บางวันก็กลางๆ แบบนี้แหละ แต่คุณก็ยังเขียนถึงสิ่งดีๆ ได้ เยี่ยมเลย!',
    };

    const msg = messages[mood];
    if (msg) {
      this.toastService.showToast(msg, false);
    }
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
    if (!this.isEditMode) {
      formData.append('showMessage', this.showMessage ? 'true' : 'false');
    }

    this.previewImages.forEach((img, index) => {
      if (img.isNew) {
        // base64 → แปลงเป็น blob
        const byteString = atob(img.src.split(',')[1]);
        const mimeString = img.src.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('imageUrls', blob, `image${index}.jpg`);
      } else {
        // URL → ส่งกลับไปเพื่อบอกว่าให้เก็บไว้
        formData.append('existingImageUrls', img.src);
      }
    });

    const request$ = this.isEditMode
      ? this.apiService.editPositiveNoteById(this.noteId!, formData)
      : this.apiService.createPositiveNote(formData);

    request$
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe({
        next: (updatedNote) => {
          console.log('Success:', updatedNote);
          console.log('Server response after edit:', updatedNote);

          // ✅ อัปเดต UI ด้วยข้อมูลล่าสุดที่ backend คืนกลับมา
          this.note = updatedNote.line1;
          this.note2 = updatedNote.line2 ?? '';
          this.note3 = updatedNote.line3 ?? '';
          this.mood = updatedNote.mood;
          this.previewImages = updatedNote.imageUrls.map((url: string) => ({
            src: url,
            isNew: false,
          }));

          this.cd.detectChanges();

          // ✅ แจ้ง parent ว่าบันทึกเสร็จแล้ว → ให้ reload list
          this.noteCreated.emit();

          // ✅ toast
          this.showMoodToast(this.mood, this.isEditMode);

          if (!this.isEditMode) {
            this.resetForm();
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastService.showToast(
            this.isEditMode
              ? 'แก้ไขบันทึกล้มเหลว'
              : 'สร้างบันทึกล้มเหลว',
            true
          );
        },
      });
  }

  private resetForm(): void {
    if (!this.isEditMode) {
      this.email = '';
      this.note = '';
      this.note2 = '';
      this.note3 = '';
      this.previewImages = [];
    }
  }
}
