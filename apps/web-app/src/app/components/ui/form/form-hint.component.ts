import { Component, input } from '@angular/core';

@Component({
  selector: 'mijo-form-hint',
  standalone: true,
  template: `
      <p class="text-xs text-foreground/50">
          <ng-content></ng-content>
      </p>
  `,
})
export class FormHintComponent {
}