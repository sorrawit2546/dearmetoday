import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor() {}
  navigateToGoogleProvide() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }
}
