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
    window.location.href = 'https://api.dearmetoday.com/api/auth/google';
  }
}
