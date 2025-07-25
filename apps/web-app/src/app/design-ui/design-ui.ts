import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../components/ui/button/button.component';
import { FormControlComponent } from '../components/ui/form/form-control.component';
import { FormItemComponent } from '../components/ui/form/form-item.component';
import { FormLabelComponent } from '../components/ui/form/form-label.component';
import { IconDirective } from '../components/ui/icon/icon.directive';
import { MijoInputDirective } from '../components/ui/input/input.directive';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../services/form-service';

@Component({
  selector: 'app-design-ui',
  imports: [
    ButtonComponent,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
    IconDirective,
    MijoInputDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './design-ui.html',
  styleUrl: './design-ui.css',
})
export class DesignUi {
  #router = inject(Router);
  #formService: FormService = inject(FormService);

  form: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),

  });

  goToAuth() {
    this.#router.navigate(['/auth']);
  }

  submit(): void {
    this.#formService.triggerValidation(this.form);
  }
}
