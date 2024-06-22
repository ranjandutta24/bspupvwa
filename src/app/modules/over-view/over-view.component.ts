import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';

@Component({
  selector: 'app-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MaterialModule, CommonModule],
})
export class OverViewComponent implements OnInit {

  constructor(
    private _router: Router,

  ) { }

  ngOnInit() {
  }

  viewHSM() {
    this._router.navigate(['./HSM-details',]);
  }

}
