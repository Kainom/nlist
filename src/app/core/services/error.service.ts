import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  message = signal<string | null>(null);
  private timer: any;

  show(msg: string) {
    this.message.set(msg);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(null), 4000);
  }

  dismiss() {
    this.message.set(null);
  }
}