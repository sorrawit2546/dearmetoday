import { Component } from '@angular/core';
import { HeroSection } from '../../components/hero-section/hero-section';
import { NoteForm } from '../../components/note-form/note-form';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [HeroSection],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
