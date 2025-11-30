import { Component } from '@angular/core';
import { tsParticles } from 'tsparticles-engine';
import { loadSnowPreset } from 'tsparticles-preset-snow';

@Component({
  selector: 'app-snow',
  imports: [],
  templateUrl: './snow.html',
  styleUrl: './snow.css',
})
export class Snow {
  async ngAfterViewInit() {
    await loadSnowPreset(tsParticles);

    tsParticles.load('snow', {
      preset: 'snow',
      background: {
        color: 'transparent',
      },
    });
  }
}
