import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';

@Component({
  selector: 'app-HSM-track',
  templateUrl: './HSM-track.component.html',
  styleUrls: ['./HSM-track.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MaterialModule, CommonModule],
})
export class HSMTrackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
