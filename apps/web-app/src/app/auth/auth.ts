import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '../components/ui/icon/icon.directive';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    IconDirective,
    RouterOutlet,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

}
