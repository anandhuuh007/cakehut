import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class Toast {
  toasts = signal<ToastMessage[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.update(current => [...current, { id, message, type }]);
    
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
