import { Component, computed, contentChild, effect, input } from '@angular/core';
import { FormControlComponent } from './form-control.component';
import { FormErrorComponent } from './form-error.component';
import { FormHintComponent } from './form-hint.component';

@Component({
  selector: 'mijo-form-item',
  standalone: true,
  template: `
      <ng-content select="mijo-form-label"/>
      <ng-content select="mijo-form-control"/>
      @if (hasErrors() && control()) {
          <mijo-form-error [errorTemplate]="errorTpl()" [control]="control()!"></mijo-form-error>
      } @else {
          <mijo-form-hint>{{ hint() }}</mijo-form-hint>
      }
  `,
  imports: [
    FormErrorComponent,
    FormHintComponent,
  ],
})
export class FormItemComponent {

  formControl = contentChild(FormControlComponent, { descendants: true });
  hint = input<string>();
  control = computed(() => this.formControl()?.control());
  errorTpl = computed(() => this.formControl()?.errorTemplate() ?? null);
  hasErrors = computed(() => !!this.formControl()?.validateStatus().errors);
}