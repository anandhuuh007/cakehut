import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gradient-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
    <span class="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
      <span class="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
      <span class="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
      <span class="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
      <span class="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
    </span>
  `
})
export class GradientTextComponent {
  @Input() className = '';

  @HostBinding('class')
  get hostClasses() {
    return 'relative inline-flex overflow-hidden bg-white dark:bg-black ' + (this.className || '');
  }
}
