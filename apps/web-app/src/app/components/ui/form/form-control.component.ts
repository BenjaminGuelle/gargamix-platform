import {
  Component,
  computed,
  contentChild,
  signal,
  effect,
  DestroyRef,
  inject,
  input,
  TemplateRef, HostListener,
} from '@angular/core';
import { AbstractControl, FormControlDirective, FormControlName, NgControl } from '@angular/forms';
import { merge, startWith, Subscription } from 'rxjs';
import { FormService } from '../../../services/form-service';

@Component({
  selector: 'mijo-form-control',
  standalone: true,
  template: `
      <div class="w-full min-h-10 border border-neutral-400 rounded-sm transition-colors duration-200 flex items-center"
           [class.!border-neutral-700]="focused()"
           [class.!border-destructive]="validateStatus().errors && !focused()">

          <ng-content select="[mijoPrefix]"></ng-content>

          <div class="flex-1 w-full min-w-0">
              <ng-content select="input,textarea,select"></ng-content>
          </div>

          <ng-content select="[mijoSuffix]"></ng-content>
      </div>
  `,
})
export class FormControlComponent {

  #destroyRef = inject(DestroyRef);
  #formService: FormService = inject(FormService);

  readonly controlName = contentChild(FormControlName, { descendants: true });
  readonly controlDirective = contentChild(FormControlDirective, { descendants: true });

  errorTemplate = input<TemplateRef<{ $implicit: any }> | null>(null);

  readonly control = signal<AbstractControl | null>(null);
  readonly status = signal<string>('VALID');
  readonly valid = signal<boolean>(true);
  readonly invalid = signal<boolean>(false);
  readonly touched = signal<boolean>(false);
  readonly dirty = signal<boolean>(false);
  readonly errors = signal<any>(null);
  readonly value = signal<any>(null);
  readonly focused = signal<boolean>(false);

  readonly ngControl = computed<NgControl | null>(() => {
    return this.controlName() ?? this.controlDirective() ?? null;
  });

  #currentSubscription: Subscription | null = null;

  @HostListener('focusin')
  onFocusIn() {
    this.focused.set(true);
  }

  @HostListener('focusout')
  onFocusOut() {
    this.focused.set(false);
  }

  constructor() {
    effect(() => {
      const ngControl = this.ngControl();
      this.#formService.validationTrigger$();

      if (this.#currentSubscription) {
        this.#currentSubscription.unsubscribe();
        this.#currentSubscription = null;
      }

      if (ngControl) {
        let control: AbstractControl | null = null;

        if (ngControl instanceof FormControlDirective) {
          control = ngControl.control;
        } else if (ngControl instanceof FormControlName) {
          control = ngControl.control;
        }

        if (control) {
          this.control.set(control);
          this.updateSignals(control);

          this.#currentSubscription = merge(
            control.statusChanges,
            control.valueChanges,
          ).pipe(startWith(null))
            .subscribe(() => {
              this.updateSignals(control!);
            });
        }
      }
    });

    this.#destroyRef.onDestroy(() => {
      if (this.#currentSubscription) {
        this.#currentSubscription.unsubscribe();
      }
    });
  }

  private updateSignals(ctrl: AbstractControl) {
    this.status.set(ctrl.status);
    this.valid.set(ctrl.valid);
    this.invalid.set(ctrl.invalid);
    this.touched.set(ctrl.touched);
    this.dirty.set(ctrl.dirty);
    this.errors.set(ctrl.errors);
    this.value.set(ctrl.value);
  }

  validateStatus() {
    return {
      status: this.status(),
      valid: this.valid(),
      invalid: this.invalid(),
      touched: this.touched(),
      dirty: this.dirty(),
      errors: this.invalid() && this.touched(),
      value: this.value(),
    };
  }
}