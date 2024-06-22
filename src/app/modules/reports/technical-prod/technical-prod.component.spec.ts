import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalProdComponent } from './technical-prod.component';

describe('TechnicalProdComponent', () => {
  let component: TechnicalProdComponent;
  let fixture: ComponentFixture<TechnicalProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalProdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
