import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css',
})
export class NoteForm {
  showErrorToast = false;
  previewImages: string[] = [];
  isDragging = false;
  email = '';
  note = '';
  mood = '';

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private apiService: Api
  ) {}

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
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('line1', this.note);
    formData.append('mood', this.mood);
  
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
  
    this.apiService.createPositiveNote(formData).subscribe({
      next: () => {
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.showErrorToast = true;
        setTimeout(() => (this.showErrorToast = false), 3000);
      },
    });
  }

  private resetForm(): void {
    this.email = '';
    this.note = '';
    this.mood = '';
    this.previewImages = [];
  }
}
