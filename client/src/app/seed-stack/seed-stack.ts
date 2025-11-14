import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-seed-stack',
  imports: [Header, CommonModule],
  templateUrl: './seed-stack.html',
  styleUrl: './seed-stack.css'
})
export class SeedStack {
  flowers = [
    { id: 1, imageUrl: 'https://picsum.photos/200?random=1', species: 'blue' },
    { id: 2, imageUrl: 'https://picsum.photos/200?random=2', species: 'blue' },
    { id: 3, imageUrl: 'https://picsum.photos/200?random=3', species: 'pink' },
    { id: 4, imageUrl: 'https://picsum.photos/200?random=4', species: 'pink' },
    { id: 5, imageUrl: 'https://picsum.photos/200?random=5', species: 'yellow' },
    { id: 6, imageUrl: 'https://picsum.photos/200?random=6', species: 'yellow' },
    { id: 7, imageUrl: 'https://picsum.photos/200?random=7', species: 'yellow' },
    { id: 8, imageUrl: 'https://picsum.photos/200?random=8', species: 'yellow' },
    { id: 9, imageUrl: 'https://picsum.photos/200?random=9', species: 'yellow' }
  ];

  // นับจำนวนสายพันธุ์แบบ unique
  speciesCount = new Set(this.flowers.map(f => f.species)).size;
}
