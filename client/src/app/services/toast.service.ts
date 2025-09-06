import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  isError: boolean;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastMessage = signal<ToastMessage | null>(null);
  
  // Public getter สำหรับ components
  getToastMessage() {
    return this.toastMessage.asReadonly();
  }

  showToast(message: string, isError = false) {
    console.log('ToastService: showToast called:', message, isError);
    
    // Clear existing toast first
    this.toastMessage.set(null);
    
    // Set new toast with unique ID
    const toastId = Date.now().toString();
    this.toastMessage.set({
      message,
      isError,
      id: toastId
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      // Only clear if this is still the current toast
      const current = this.toastMessage();
      if (current?.id === toastId) {
        console.log('ToastService: Clearing toast');
        this.toastMessage.set(null);
      }
    }, 3000);
  }

  clearToast() {
    this.toastMessage.set(null);
  }
}
