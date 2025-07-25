import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '../../components/ui/icon/icon.directive';
import { FormControlComponent } from '../../components/ui/form/form-control.component';
import { FormItemComponent } from '../../components/ui/form/form-item.component';
import { FormLabelComponent } from '../../components/ui/form/form-label.component';
import { MijoInputDirective } from '../../components/ui/input/input.directive';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormControlComponent,
    FormItemComponent,
    FormLabelComponent,
    MijoInputDirective,
    ButtonComponent,
    IconDirective,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  visibilityPass = signal(false);

  togglePass(): void {
    this.visibilityPass.update((on) => !on);
  }

  loginWithEmailAndPassword(): void {

  }

  loginWithGoogle(): void {

  }
}
