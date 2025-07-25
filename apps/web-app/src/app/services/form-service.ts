import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface FormValidationState {
  isValid: boolean;
  firstErrorField?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FormService {

  formState = signal<FormValidationState>({ isValid: true });
  #validationTrigger = signal(0);

  constructor() {
  }

  triggerValidation(form: FormGroup): void {
    this.#markAllAsTouchedAndDirty(form);
    form.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    // ✅ Notifier tous les FormControlComponent
    this.#validationTrigger.update(v => v + 1);

    this.#scrollToFirstError(form);
  }

  get validationTrigger$() {
    return this.#validationTrigger.asReadonly();
  }

  #markAllAsTouchedAndDirty(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(childControl => {
        this.#markAllAsTouchedAndDirty(childControl);
      });
    }
    control.markAsTouched();
    control.markAsDirty();
  }

  controlHaveErrorOn(form: FormGroup, controlName: string, errorName: string): boolean {
    return form.get(controlName)?.hasError(errorName) || false;
  }

  #scrollToFirstError(form: FormGroup): void {
    const firstErrorField = this.#getFirstErrorField(form);
    if (firstErrorField) {
      const element = document.querySelector(`[formControlName="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  #getFirstErrorField(form: FormGroup): string | undefined {
    return Object.keys(form.controls).find(key =>
      form.get(key)?.errors && form.get(key)?.touched,
    );
  }
}
