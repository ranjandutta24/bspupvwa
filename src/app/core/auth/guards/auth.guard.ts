import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'app/services/user.service';
import { CommonService } from 'app/services/common.service';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation = [];
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private userService: UserService,
        private commonService: CommonService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean> {
        // console.log(redirectURL);
        // return of(true);

        let authUser = this.commonService.getItem('currentUser');
        console.log(authUser);

        //let navigation = this.commonService.getItem('navigation');


        if (!authUser) {
            // Redirect to the sign-in page
            this._router.navigate(['sign-in'], { queryParams: { redirectURL } }); //, { queryParams: { redirectURL } }
            ;

            // Prevent the access
            return of(false);
        }else{
            return of(true);
        }
        // return this.userService.verifyToken(authUser)
        //     .pipe(switchMap((authenticated) => {
        //         console.log(authenticated);

        //         // If the user is not authenticated...
        //         if (!authenticated) {
        //             // Redirect to the sign-in page
        //             this._router.navigate(['sign-in'], { queryParams: { redirectURL } });

        //             // Prevent the access
        //             return of(false);
        //         }
        //         else {
        //             let type = this.commonService.getItem('selectedCategory');

        //             let userRole = this.commonService.getItem('currentRole');
        //             let nav = JSON.parse(JSON.stringify(defaultNavigation));
        //             this.navigation = [];
        //             nav.map(item => {
        //                 this.navigation = this.navigation.concat(item.children);
        //             })
        //             console.log(this.navigation);


                    // this._navigationService.navigation$
                    //     .pipe(takeUntil(this._unsubscribeAll))
                    //     .subscribe((navigation: Navigation) => {
                    //         console.log(navigation);

                    //         let nav = navigation.default;
                    //         this.navigation = [];
                    //         nav.map(item => {
                    //             this.navigation = this.navigation.concat(item.children);
                    //         })
                    //         console.log(this.navigation);


                    //     });
                    //  console.log(this.navigation);
                    // return of(true);

                    // let index = this.navigation.filter(e => e.link).map(n => n.link).indexOf(redirectURL);
                    // console.log(index);
                    // if (index != -1) {
                    //     if (this.navigation.length > 0) {
                    //         if (this.navigation[index].privilege) {
                    //             if (userRole.privilege.includes(this.navigation[index].privilege[0])) {
                    //                 return of(true);
                    //             }
                    //             else {
                    //                 this._router.navigate(['/files/files']);
                    //                 return of(true);
                    //             }
                    //         }

                    //     }
                    // }
                    // return of(true);


                // }

                // Allow the access

            // })
            // );
    }
    /* private _check(redirectURL: string): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {

                           // If the user is not authenticated...
                           if ( !authenticated )
                           {
                               // Redirect to the sign-in page
                               this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

                               // Prevent the access
                               return of(false);
                           }

                           // Allow the access
                           return of(true);
                       })
                   );
    } */
}
