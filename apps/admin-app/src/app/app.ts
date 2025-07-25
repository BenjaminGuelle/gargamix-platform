import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { lucideChevronRight, lucideMail } from '@ng-icons/lucide';
import { HlmFormFieldComponent } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    HlmButtonDirective,
    NgIcon,
    HlmIconDirective,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmLabelDirective,
    ReactiveFormsModule,
  ],
  providers: [provideIcons({ lucideChevronRight, lucideMail })],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'admin-app';
}
