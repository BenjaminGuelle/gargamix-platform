import { Component, computed, input } from '@angular/core';
import { IconDirective } from '../icon/icon.directive';
import clsx from 'clsx';

export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
export type Size = 'default' | 'sm' | 'lg' | 'icon' | 'input';

const CLASSES = {
  base: 'flex items-center w-full justify-center gap-2 cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  variant: {
    default: 'bg-foreground text-white hover:bg-foreground/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-white',
    primary: 'bg-primary text-white hover:bg-primary/80',
    secondary: 'bg-secondary-300 text-foreground hover:bg-secondary-300/80',
    ghost: 'hover:bg-accent hover:text-white',
    link: 'underline-offset-4 hover:underline text-foreground',
  },
  size: {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10 !rounded-full',
    input: 'h-5 w-5 p-0 rounded-full',
  },
};

@Component({
  selector: 'mijo-button',
  standalone: true,
  imports: [IconDirective],
  template: `
      <button [class]="classes()" [disabled]="disable()">
          <ng-content/>
          @if (loading()) {
              <i [name]="'spin'" [class]="'w-4 h-4 animate-spin'"></i>
          }
      </button>
  `,
})
export class ButtonComponent {

  variant = input<Variant>('default');
  size = input<Size>('default');

  loading = input<boolean>(false);
  disable = input<boolean>(false);

  classes = computed(() => {
    return clsx(
      CLASSES.base,
      CLASSES.variant[this.variant()],
      CLASSES.size[this.size()],
    );
  });
}
