import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { entryNote } from '../../model/entry-note';
import { Api, AuthResponse } from '../../services/api';
import { ToastService } from '../../services/toast.service';

type PreviewImage = {
  src: string;
  isNew: boolean;
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
  @Output() noteCreated = new EventEmitter<entryNote>();
  @Output() closed = new EventEmitter<void>();
  @Input() noteId!: string;

  isEditMode = false;
  private readonly AUTOSAVE_KEY = 'dearmetoday_noteform_autosave';

  isLoading = signal(false);
  isDragging = signal(false);
  email = signal('');
  note = signal('');
  note2 = signal('');
  note3 = signal('');
  mood = signal('happy');
  createdAt = signal('');
  showMessage = signal(false);
  previewImages = signal<PreviewImage[]>([]);
  formattedDate = signal('');

  constructor(
    private ngZone: NgZone,
    private apiService: Api,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.formattedDate.set(
      now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    );

    this.apiService.getUserdataFromGoogle().subscribe({
      next: (response: AuthResponse) => {
        this.ngZone.run(() => {
          setTimeout(() => {
            this.email.set(response.user.email);
            this.isLoading.set(false);
            // โหลดข้อมูล autosave หลังจากได้ email แล้ว
            this.loadAutosaveData();
          });
        });
      },
      error: (err) => console.error('Error loading user data:', err),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.noteId);
    if (changes['noteId']?.currentValue) {
      this.isEditMode = true;
      this.loadNoteData();
    }
  }

  isFormValid() {
    return this.note()?.trim() || this.note2()?.trim() || this.note3()?.trim();
  }

  loadNoteData() {
    this.isLoading.set(true);
    this.apiService.getPositiveNoteById(this.noteId).subscribe({
      next: (data: entryNote) => {
        this.ngZone.run(() => {
          this.email.set(data.email);
          this.note.set(data.line1 ?? '');
          this.note2.set(data.line2 ?? '');
          this.note3.set(data.line3 ?? '');
          this.mood.set(data.mood);
          this.previewImages.set(
            data.imageUrls.map((url) => ({ src: url, isNew: false }))
          );
          this.createdAt.set(
            new Date(data.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          );
          this.isLoading.set(false);
        });
      },
      error: (err) => {
        console.error('Error loading note data', err);
        this.isLoading.set(false);
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

  private handleFiles(files: File[]): void {
    const remainingSlots = 5 - this.previewImages().length;
    const validFiles = files.slice(0, remainingSlots);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.ngZone.run(() => {
          setTimeout(() => {
            this.previewImages.update((imgs) => [
              ...imgs,
              { src: reader.result as string, isNew: true },
            ]);
            // autosave หลังจากเพิ่มรูปภาพ
            this.onFormChange();
          });
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.previewImages.update((imgs) => imgs.filter((_, i) => i !== index));
    // autosave หลังจากลบรูปภาพ
    this.onFormChange();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) this.handleFiles(Array.from(files));
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  submitForm() {
    this.confirmDialog.nativeElement.showModal();
  }
  cancelSend() {
    this.confirmDialog.nativeElement.close();
    // ไม่ส่ง closed.emit() เพื่อให้ผู้ใช้ยังคงอยู่ในหน้า note-form
  }

  // ฟังก์ชันสำหรับปิดฟอร์มและล้างข้อมูล autosave
  closeForm(): void {
    this.clearAutosaveData();
    this.closed.emit();
  }

  private showMoodToast(mood: string, isEdit: boolean = false) {
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
    if (msg) this.toastService.showToast(msg, false);
  }

  confirmSend() {
    console.log('📝 Submitting form with values:', {
      isEditMode: this.isEditMode,
      noteId: this.noteId,
      email: this.email(),
      line1: this.note(),
      line2: this.note2(),
      line3: this.note3(),
      mood: this.mood(),
      previewImages: this.previewImages(),
    });
    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('email', this.email());
    formData.append('line1', this.note());
    formData.append('line2', this.note2());
    formData.append('line3', this.note3());
    formData.append('mood', this.mood());
    if (!this.isEditMode) {
      formData.append('showMessage', this.showMessage() ? 'true' : 'false');
    }

    this.previewImages().forEach((img, index) => {
      if (img.isNew) {
        const byteString = atob(img.src.split(',')[1]);
        const mimeString = img.src.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
          ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: mimeString });
        formData.append('imageUrls', blob, `image${index}.jpg`);
      } else {
        formData.append('existingImageUrls', img.src);
      }
    });

    const request$ = this.isEditMode
      ? this.apiService.editPositiveNoteById(this.noteId!, formData)
      : this.apiService.createPositiveNote(formData);

    request$.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (updatedNote) => {
        this.ngZone.run(() => {
          this.note.set(updatedNote.line1);
          this.note2.set(updatedNote.line2 ?? '');
          this.note3.set(updatedNote.line3 ?? '');
          this.mood.set(updatedNote.mood);
          this.previewImages.set(
            updatedNote.imageUrls.map((url: string) => ({
              src: url,
              isNew: false,
            }))
          );

          this.noteCreated.emit(updatedNote);
          this.showMoodToast(this.mood(), this.isEditMode);
          if (this.isEditMode) {
            this.loadNoteData();
          } else {
            this.resetForm();
          }
          // ล้างข้อมูล autosave หลังจากบันทึกสำเร็จ
          this.clearAutosaveData();
          this.closed.emit();
        });
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastService.showToast(
          this.isEditMode ? 'แก้ไขบันทึกล้มเหลว' : 'สร้างบันทึกล้มเหลว',
          true
        );
      },
    });
  }

  private resetForm(): void {
    this.email.set('');
    this.note.set('');
    this.note2.set('');
    this.note3.set('');
    this.previewImages.set([]);
    this.clearAutosaveData();
  }

  // ฟังก์ชัน autosave
  private saveToLocalStorage(): void {
    if (this.isEditMode) return; // ไม่ autosave ในโหมดแก้ไข

    const autosaveData = {
      note: this.note(),
      note2: this.note2(),
      note3: this.note3(),
      mood: this.mood(),
      showMessage: this.showMessage(),
      previewImages: this.previewImages().filter((img) => img.isNew), // เฉพาะรูปใหม่
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify(autosaveData));
    } catch (error) {
      console.warn('ไม่สามารถบันทึกข้อมูล autosave ได้:', error);
    }
  }

  // ฟังก์ชันโหลดข้อมูลจาก localStorage
  private loadAutosaveData(): void {
    if (this.isEditMode) return; // ไม่โหลด autosave ในโหมดแก้ไข

    try {
      const savedData = localStorage.getItem(this.AUTOSAVE_KEY);
      if (savedData) {
        const autosaveData = JSON.parse(savedData);

        // ตรวจสอบว่าข้อมูลไม่เก่าเกิน 24 ชั่วโมง
        const isDataFresh =
          Date.now() - autosaveData.timestamp < 24 * 60 * 60 * 1000;

        if (
          isDataFresh &&
          (autosaveData.note || autosaveData.note2 || autosaveData.note3)
        ) {
          this.note.set(autosaveData.note || '');
          this.note2.set(autosaveData.note2 || '');
          this.note3.set(autosaveData.note3 || '');
          this.mood.set(autosaveData.mood || 'happy');
          this.showMessage.set(autosaveData.showMessage || false);
          this.previewImages.set(autosaveData.previewImages || []);

          console.log('โหลดข้อมูล autosave สำเร็จ');
        } else {
          this.clearAutosaveData();
        }
      }
    } catch (error) {
      console.warn('ไม่สามารถโหลดข้อมูล autosave ได้:', error);
      this.clearAutosaveData();
    }
  }

  // ฟังก์ชันล้างข้อมูล autosave
  private clearAutosaveData(): void {
    try {
      localStorage.removeItem(this.AUTOSAVE_KEY);
    } catch (error) {
      console.warn('ไม่สามารถล้างข้อมูล autosave ได้:', error);
    }
  }

  // ฟังก์ชันสำหรับเรียกใช้ autosave เมื่อมีการเปลี่ยนแปลง
  onFormChange(): void {
    if (!this.isEditMode) {
      this.saveToLocalStorage();
    }
  }
}
