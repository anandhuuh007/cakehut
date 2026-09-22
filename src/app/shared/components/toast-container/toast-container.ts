import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div 
        *ngFor="let toast of toasts()"
        [ngClass]="{
          'bg-green-500': toast.type === 'success',
          'bg-rose-500': toast.type === 'error',
          'bg-blue-500': toast.type === 'info'
        }"
        class="text-white px-6 py-3 rounded-xl shadow-lg pointer-events-auto flex items-center justify-between gap-4 animate-fadeIn min-w-[250px]"
      >
        <span class="text-sm font-bold">{{ toast.message }}</span>
        <button (click)="removeToast(toast.id)" class="opacity-70 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class ToastContainer {
  toasts = computed(() => this.toastService.toasts());

  constructor(public toastService: Toast) {}

  removeToast(id: string) {
    this.toastService.remove(id);
  }
}
