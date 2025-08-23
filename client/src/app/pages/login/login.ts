import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(){}
  navigateToGoogleProvide(){
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
