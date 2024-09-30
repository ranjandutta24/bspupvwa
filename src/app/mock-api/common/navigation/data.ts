/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [

    {
        id: 'dashboards',
        // title: 'Dashboards',
        // subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        features: ["Settings"],
        privilege: ["App Dashboard", "View User Log", "Dashboard"],
        children: [
        ],
    },

    {
        id: 'BSL',
        title: 'BSL',
        type: 'collapsable',
        icon: 'people',
        privilege: ["View User"],
        features: ["BSL"],
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'basic',
                icon: 'people',
                link: '/human-resource/users',
                privilege: ["View User"]
            },

        ]
    },

    {
        id: 'reports',
        title: 'HSM',
        type: 'collapsable',
        icon: 'grid_view',
        // privilege: ["View User", "View Role", "View Department", "View Designation"],
        features: ["HSM"],
        children: [
            {
                id: 'reports.shift-hourly-report',
                title: 'Shift Hourly Report',
                type: 'basic',
                icon: 'list',
                link: '/reports/shift-hourly-report',
                // privilege: ["View User"]
            },
            {
                id: 'reports.scheduled-report',
                title: 'Rolling Sequence',
                type: 'basic',
                icon: 'list',
                link: '/reports/scheduled-report',
                // privilege: ["View User"]
            },
            {
                id: 'reports.customer-prod',
                title: 'Customer Production Report',
                type: 'basic',
                icon: 'list',
                link: '/reports/customer-prod',
                // privilege: ["View User"]
            },
            {
                id: 'reports.quality-report',
                title: 'Quality Report',
                type: 'basic',
                icon: 'list',
                link: '/reports/quality-report',
                // privilege: ["View User"]
            },
            {
                id: 'reports.technical-prod',
                title: 'Technical Production Report',
                type: 'basic',
                icon: 'list',
                link: '/reports/technical-prod',
                // privilege: ["View User"]
            },
            {
                id: 'reports.temp-trend-report',
                title: 'Temp Trend Report',
                type: 'basic',
                icon: 'list',
                link: '/reports/temp-trend-report',
                // privilege: ["View User"]
            },
        ]
    },

    {
        id: 'tracking',
        title: 'Tracking',
        type: 'collapsable',
        icon: 'people',
        privilege: ["View User"],
        features: ["BSL"],
        children: [
            {
                id: 'tracking-page',
                title: 'Tracking Page',
                type: 'basic',
                icon: 'people',
                link: 'tracking-page',
                privilege: ["View User"]
            },

        ]
        // children: [
        //     {
        //         id: 'tracking-page',
        //         title: 'Tracking Page',
        //         type: 'basic',
        //         icon: 'people',
        //         link: 'tracking-three-js',
        //         privilege: ["View User"]
        //     },

        // ]
    },




];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
