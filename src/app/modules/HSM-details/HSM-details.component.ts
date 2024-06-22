import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';

@Component({
  selector: 'app-HSM-details',
  templateUrl: './HSM-details.component.html',
  styleUrls: ['./HSM-details.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MaterialModule, CommonModule],
})
export class HSMDetailsComponent implements OnInit {

  constructor(
    private _router: Router,

  ) { }

  ngOnInit() {
  }
  viewHSMTrack() {
    // this._router.navigate(['./HSM-track',]);
  }
}
