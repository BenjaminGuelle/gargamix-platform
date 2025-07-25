import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mijo-form-label',
  standalone: true,
  template: `
      <div class="flex justify-between items-center text-sm font-semibold text-foreground/75">
          <ng-content></ng-content>
          @if (required()) {
              <span class="text-xs font-light">Requis</span>
          }
      </div>
  `,
})
export class FormLabelComponent {
  label = input<string>();
  required = input(false, { transform: booleanAttribute });
}