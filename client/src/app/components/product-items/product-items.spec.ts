import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItems } from './product-items';

describe('ProductItems', () => {
  let component: ProductItems;
  let fixture: ComponentFixture<ProductItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
