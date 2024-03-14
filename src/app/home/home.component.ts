import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  afauth = inject(Auth);
  router = inject(Router);
  userSignal = toSignal(user(this.afauth));

  constructor() {}

  ngOnInit() {}

  signOut() {
    from(signOut(this.afauth)).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
