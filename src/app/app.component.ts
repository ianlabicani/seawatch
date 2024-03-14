import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  auth = inject(Auth);
  router = inject(Router);

  title = 'seawatch';

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
    console.log(environment.production);
  }
}
