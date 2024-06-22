import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, FuseVerticalNavigationComponent, NotificationsComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, RouterOutlet, QuickChatComponent],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: any;
    currentUser: any;
    organizationData = { oname: '', logo: '', logoURL: '' };
    titleInTop = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        // private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private commonService: CommonService,
        private userService: UserService,
        private organizationService: OrganizationService,
        private _changeDetectorRef: ChangeDetectorRef,


    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // alert('3')
        this.user = this.commonService.getItem('currentUser');
        if (this.user) {
            this.currentUser = JSON.parse(JSON.stringify(this.user));
            this.user.imageUrl = this.userService.profilePic(this.user['image']);
            this.currentUser.imageUrl = this.userService.profilePic(this.user['image']);
            if (this.currentUser.ocode) this.getOrganizationData();
            else this.organizationData = undefined;
        }
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened if
                if (matchingAliases.includes("lg")) {
                    this.titleInTop = true;
                } else {
                    this.titleInTop = false;
                }
            });
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service


        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
        //this.user = this.commonService.getItem('currentUser');
        this.getUserFromStore();

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    getUserFromStore() {
        this.commonService.currentUser
            .subscribe(response => {
                console.log(response);

                if (response) {
                    //   alert('1')
                    this.user = JSON.parse(JSON.stringify(response));
                    this.currentUser = JSON.parse(JSON.stringify(response));
                    this.user.imageUrl = this.userService.profilePic(this.user['image']);
                    this.currentUser.imageUrl = this.userService.profilePic(this.user['image']);
                    if (this.currentUser.ocode) this.getOrganizationData();
                    else this.organizationData = undefined;
                    this._changeDetectorRef.markForCheck();

                }
                else this.getUserFromStorage()
            })

    }

    getUserFromStorage() {
        //alert('2')
        let user = this.commonService.getItem('currentUser');
        console.log(user);
        if (user) this.commonService.currentUser.next(user)
        this._changeDetectorRef.markForCheck();

    }

    //Get Organization Details
    getOrganizationData() {
        // alert('1')
        this.organizationService.showByCode(this.currentUser.ocode)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                console.log(response);
                this.organizationData = JSON.parse(JSON.stringify(response));
                //if (this.organizationData.logo) {
                this.organizationData.logoURL = this.organizationService.orgLogo(this.organizationData.logo);
                //  }

                console.log(this.organizationData);
                console.log(this.organizationData.oname.length);
            },
                respError => {
                    this.commonService.showSnakBarMessage(respError, 'error', 2000);
                })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    };

    viewOrg() {
        this._router.navigate(['/organization']);

    }

    goOverview() {
        this._router.navigate(['/over-view']);

    }
}
