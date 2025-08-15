import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCardAll } from './note-card-all';

describe('NoteCardAll', () => {
  let component: NoteCardAll;
  let fixture: ComponentFixture<NoteCardAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCardAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteCardAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
