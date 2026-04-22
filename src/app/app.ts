import { Component, signal } from '@angular/core';
import { Sidenav } from './core/components/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
