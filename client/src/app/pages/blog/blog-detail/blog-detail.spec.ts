import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetail } from './blog-detail';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

describe('BlogDetail', () => {
  let component: BlogDetail;
  let fixture: ComponentFixture<BlogDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
