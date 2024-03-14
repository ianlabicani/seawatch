import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';

export const authGuard = () => {
  const afauth = inject(Auth);
  const router = inject(Router);

  return user(afauth).pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (!user) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
