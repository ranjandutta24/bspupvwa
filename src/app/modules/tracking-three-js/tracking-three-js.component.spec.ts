import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingThreeJsComponent } from './tracking-three-js.component';

describe('TrackingThreeJsComponent', () => {
  let component: TrackingThreeJsComponent;
  let fixture: ComponentFixture<TrackingThreeJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingThreeJsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackingThreeJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
