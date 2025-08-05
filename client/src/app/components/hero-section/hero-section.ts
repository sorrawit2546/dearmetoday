import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {
  constructor(private router: Router){}
  navigateToGoogleProvide(){
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
