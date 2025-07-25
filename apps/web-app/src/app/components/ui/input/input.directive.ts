import { Directive } from '@angular/core';

@Directive({
  selector: '[mijoInput]',
  standalone: true,
  host: {
    'class': 'block w-full h-full border-none outline-none bg-transparent px-3 py-2 text-sm font-bold placeholder:font-normal placeholder:text-sm placeholder:text-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-foreground/30',
  },
})
export class MijoInputDirective {
}
