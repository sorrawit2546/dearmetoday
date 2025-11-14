import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedStack } from './seed-stack';

describe('SeedStack', () => {
  let component: SeedStack;
  let fixture: ComponentFixture<SeedStack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedStack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedStack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
