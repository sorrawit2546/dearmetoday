import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingTable } from './pricing-table';

describe('PricingTable', () => {
  let component: PricingTable;
  let fixture: ComponentFixture<PricingTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
