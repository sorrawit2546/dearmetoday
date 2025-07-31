import { Component } from '@angular/core';
import { HeroSection } from '../../components/hero-section/hero-section';
import { NoteForm } from '../../components/note-form/note-form';

@Component({
  selector: 'app-home',
  imports: [HeroSection, NoteForm],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
