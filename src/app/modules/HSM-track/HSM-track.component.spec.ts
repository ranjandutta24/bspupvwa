/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HSMTrackComponent } from './HSM-track.component';

describe('HSMTrackComponent', () => {
  let component: HSMTrackComponent;
  let fixture: ComponentFixture<HSMTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HSMTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HSMTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
