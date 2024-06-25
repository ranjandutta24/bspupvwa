import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/services/common.service';
import { RoleService } from 'app/services/role.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    private _unsubscribeAll: Subject<any> = new Subject();


    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    signingin = false;
    signinButtontext = 'LOGIN';
    user = { userid: '', password: '' };
    coverUrl = '';

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private commonService: CommonService,
        private userService: UserService,
        private roleService: RoleService,
        private _snackBar: MatSnackBar
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            userid: ['', [Validators.required]],
            password: ['', Validators.required],
            //rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn() {
        let obj = {
            userid: this.user.userid,
            password: this.user.password
        }
        this.userService.signin(obj)
            .subscribe(response=>{
                console.log(response);
                this.navigateByUrl();
            },respError => {
                this.commonService.showSnakBarMessage(respError, 'error', 2000);
              })
    }
    signInUser(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        // this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.userService.signin(this.signInForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                let currentUser = JSON.parse(JSON.stringify(response));
                console.log(currentUser);

                console.log(currentUser.features)
                // this.commonService.setItem('currentUser', currentUser);
                // setTimeout(() => {
                //     this.commonService.currentUser.next(currentUser);
                // }, 500);
                if (!currentUser.features) {
                    this.commonService.getFeatures()
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(
                            (data: any) => {
                                console.log(data);
                                let features = JSON.parse(JSON.stringify(data));
                                let newdata = [];
                                if (features.length > 0) {
                                    for (let i = 0; i < features.length; i++) {
                                        newdata.push(features[i].name);
                                    }
                                    currentUser.features = newdata;
                                }
                                this.commonService.currentUser.next(currentUser)
                                //  this.store.dispatch(signin({ user: currentUser }));
                                this.getDefaultRoles(currentUser);
                                //  this.navigateByUrl();
                            })
                }
                else {
                    this.commonService.setItem('currentUser', response);
                    this.commonService.currentUser.next(response)
                    // this.store.dispatch(signin({ user: response }));
                    this.getDefaultRoles(currentUser);
                    //this.navigateByUrl();
                }



            },
                (respError) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: respError
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );


        // Sign in
        /* this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            ); */
    }

    getDefaultRoles(user: any) {
        this.commonService.getDefaultRole()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                let defaultRoles = JSON.parse(JSON.stringify(response));
                console.log(response);
                let index = defaultRoles.map(item => item.name).indexOf(user.role);
                if (index >= 0) {
                    console.log(index);

                    // this.store.dispatch(new SetUserRoleAction(defaultRoles[index]));
                    this.commonService.setItem('currentRole', defaultRoles[index]);
                    this.redirectToDashboad(user, defaultRoles[index]);
                }
                else this.getCustomRole(user);
            })
    }

    getCustomRole(user) {
        let obj = { ocode: user.ocode, name: user.role };
        //  console.log(obj)
        this.roleService
            .search(obj)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (response) => {
                    console.log(response);

                    if (response) {
                        let role = JSON.parse(JSON.stringify(response));
                        // this.store.dispatch(new SetUserRoleAction(role));
                        this.commonService.setItem("currentRole", role[0]);
                        this.redirectToDashboad(user, role[0]);
                    }
                },
                (respError) => {
                    this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
                    this.signingin = false;
                    this.signinButtontext = "LOGIN";
                }
            );

    }

    navigateByUrl() {
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
        console.log(redirectURL);

        this._router.navigateByUrl(redirectURL);
    }

    redirectToDashboad(currentUser: any, role: any) {
        console.log(role.privilege);
        let privilege = [];
        privilege = JSON.parse(JSON.stringify(role.privilege));
        this.signingin = false;
        this.signinButtontext = 'LOGIN';
        console.log(currentUser);
        this.commonService.setItem('currentUser', currentUser);
        this.commonService.currentUser.next(currentUser)
        if (currentUser.onetime) {

            this._router.navigateByUrl('reset-password');
        }
        else {
            if (privilege.includes('App Dashboard')) {
                //Redirect to App Dashboard
                this._router.navigate(['/dashboards/app-dashboard']);
            }
            // else if (currentUser.role == 'ZONEADMIN' || currentUser.role == 'ZONALADMIN') {
            //     //Redirect to App Dashboard
            //     this._router.navigate(['dashboards/zone-dashboard']);
            // }
            else {
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                console.log(redirectURL);

                this._router.navigateByUrl(redirectURL);
                // if (privilege.includes('Dashboard')) {
                //     this._router.navigate(['/dashboards/project-dashboard']);
                // }
                // else {
                //     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                //     console.log(redirectURL);

                //     this._router.navigateByUrl(redirectURL);
                // }
                //Redirect to Dashboard

            }

        }
    }
}
