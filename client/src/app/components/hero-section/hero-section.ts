import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../pages/login/login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [Login, RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {
  constructor(private router: Router){}
  navigateToGoogleProvide(){
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
