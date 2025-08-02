import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Api } from '../../services/api';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css',
})
export class NoteForm {
  toastError = false;
  toastMessage: string | null = null;
  isLoading = false;
  showErrorToast = false;
  previewImages: string[] = [];
  isDragging = false;
  email = '';
  note = '';
  mood = 'happy';

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
    console.log('Starting form submission...');
    this.isLoading = true;
    console.log('isLoading set to:', this.isLoading);
    this.cd.detectChanges(); // Force change detection

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
          this.resetForm();
          this.showToast('Send magic message complete! 🎉', false);
        },
        error: (err) => {
          console.error('Error:', err);
          this.showErrorToast = true;
          this.showToast('faile to send magic message! ', true);
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

  showToast(message: string, isError = false) {
    this.toastMessage = message;
    this.toastError = isError;

    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
