import { Component, input, TemplateRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mijo-form-error',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
      <div class="text-xs text-destructive mt-1">
          @if (errorTemplate()) {
              <!-- Template personnalisé avec le contrôle en contexte -->
              <ng-container *ngTemplateOutlet="errorTemplate(); context: { $implicit: control() }"></ng-container>
          } @else {
              <!-- Template par défaut -->
              <ng-container
                      *ngTemplateOutlet="defaultErrorTemplate; context: { $implicit: control() }"></ng-container>
          }
      </div>

      <!-- Template par défaut -->
      <ng-template #defaultErrorTemplate let-control>
          @if (control?.hasError('required')) {
              Ce champ est requis
          }
          @if (control?.hasError('email')) {
              Format email invalide
          }
          @if (control?.hasError('minlength')) {
              Minimum {{ control.getError('minlength')?.requiredLength }} caractères
          }
          @if (control?.hasError('maxlength')) {
              Maximum {{ control.getError('maxlength')?.requiredLength }} caractères
          }
          @if (control?.hasError('pattern')) {
              Format invalide
          }
      </ng-template>
  `,
})
export class FormErrorComponent {
  control = input.required<AbstractControl>();
  errorTemplate = input<TemplateRef<{ $implicit: any }> | null>(null);
}