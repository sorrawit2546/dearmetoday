import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectStampComponent } from './collect-stamp-component';

describe('CollectStampComponent', () => {
  let component: CollectStampComponent;
  let fixture: ComponentFixture<CollectStampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectStampComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
