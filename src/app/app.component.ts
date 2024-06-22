import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { RouterOutlet } from '@angular/router';
import { DateFormat } from './date-format';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
    providers: [{ provide: DateAdapter, useClass: DateFormat }]
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(private dateAdapter: DateAdapter<Date>

    ) {
        dateAdapter.setLocale("en-in"); // DD/MM/YYYY
    }
}
