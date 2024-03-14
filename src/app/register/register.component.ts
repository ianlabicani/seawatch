import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  afauth = inject(Auth);

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });
  validationMessages = {
    username: [
      { type: 'required', message: 'Email is required' },
      {
        type: 'minlength',
        message: 'Username must be at least 3 characters long',
      },
    ],
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
    confirmPassword: [
      { type: 'required', message: 'Confirm Password is required.' },
      { type: 'passwordsMatch', message: "Password doesn't match." },
    ],
  };
  errorMessage: string | null = null;

  get passwordsMatch() {
    return (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmPassword')?.value
    );
  }

  constructor() {}

  ngOnInit() {
    this.registerForm
      .get('confirmPassword')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (this.registerForm.get('confirmPassword')?.hasError('required'))
          return;
        if (!this.passwordsMatch) {
          this.registerForm
            .get('confirmPassword')
            ?.setErrors({ passwordsMatch: true });
        }
      });
  }

  register() {
    const { username, email, password } = this.registerForm.getRawValue();
    from(
      createUserWithEmailAndPassword(this.afauth, email, password)
    ).subscribe({
      next: (userCredential) => {
        from(
          updateProfile(userCredential.user, {
            displayName: username,
          })
        ).subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
        });
      },
      error: (err) => {
        console.log(err.message);

        this.errorMessage = err.message;
      },
    });
  }
}
