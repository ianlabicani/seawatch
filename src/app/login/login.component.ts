import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  afauth = inject(Auth);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Email must be a valid email address' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long',
      },
    ],
  };
  errorMessage: string | null = null;

  login() {
    const { email, password } = this.loginForm.getRawValue();
    from(signInWithEmailAndPassword(this.afauth, email, password)).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
    });
  }
}
