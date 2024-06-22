import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { CommonService } from 'app/services/common.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MaterialModule, NgIf, NgFor, NgClass, CommonModule],
})
export class UserFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private commonService: CommonService,
    public matDialogRef: MatDialogRef<UserFormComponent>,
  ) { }

  ngOnInit() {
  }

}
