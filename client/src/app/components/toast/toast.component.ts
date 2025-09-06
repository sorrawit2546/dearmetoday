import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="toastService.getToastMessage()()"
      class="toast toast-top toast-end z-50 transition-all duration-500 ease-in-out"
    >
      <div
        class="alert shadow-lg flex items-center gap-3 rounded-xl p-4"
        [ngClass]="toastService.getToastMessage()()?.isError ? 'alert-error' : 'alert-success'"
      >
        <!-- Error Icon -->
        <svg
          *ngIf="toastService.getToastMessage()()?.isError; else successIcon"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.986-.816 2.07-1.866L21.86 7.134A2.072 2.072 0 0019.79 5H4.21c-1.054 0-1.986.816-2.07 1.866l-1.072 12a2.072 2.072 0 002.07 2.134z"
          />
        </svg>
        
        <!-- Success Icon -->
        <ng-template #successIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </ng-template>

        <!-- Message -->
        <span class="font-medium text-base">{{ toastService.getToastMessage()()?.message }}</span>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
