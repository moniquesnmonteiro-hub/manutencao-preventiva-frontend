import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Sidenav } from './core/components/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  showSidenav = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => !e.urlAfterRedirects.startsWith('/login')),
      startWith(!this.router.url.startsWith('/login'))
    )
  );
}
