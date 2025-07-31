import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule],
  templateUrl: './note-form.html',
  styleUrl: './note-form.css'
})
export class NoteForm {
  previewImages: string[] = [];
  isDragging = false;

  constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) {}

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

    validFiles.forEach(file => {
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
}
