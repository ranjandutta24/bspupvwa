import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserService } from 'app/services/user.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';



const routes: Routes = [
    {
        path: '',
        component: UsersComponent,

    },
];

export default routes;