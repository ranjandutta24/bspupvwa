import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProdComponent } from './customer-prod.component';

describe('CustomerProdComponent', () => {
  let component: CustomerProdComponent;
  let fixture: ComponentFixture<CustomerProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
