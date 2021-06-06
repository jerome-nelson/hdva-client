import { lazy } from "react";

export const ROUTES = [
    {
        auth: true,
        exact: true,
        props: {
            path: '/',
        },
        component: lazy(() => import("./pages/dashboard/dashboard.page"))
    },
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/login',
        },
        component: lazy(() => import("./pages/login/login.page"))
    },
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/forgotten-password',
        },
        component: lazy(() => import("./pages/forgotten-email/forgotten-email.page"))
    },  
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/verification',
        },
        component: lazy(() => import("./pages/password-reset/password-reset.page"))
    },
    {
        auth: true,
        props: {
            path: '/settings',
        },
        component: lazy(() => import("./pages/settings/settings.page"))
    },  
    {
        auth: true,
        exact: true,
        props: {
            path: '/properties',
        },
        component: lazy(() => import("./pages/property-overview/property-overview.page"))
    },
    {
        auth: true,
        props: {
            path: '/properties/:id',
        },
        component: lazy(() => import("./pages/properties/properties.page"))
    },
    {
        auth: true,
        props: {
            path: '/profile-settings',
        },
        component: lazy(() => import("./pages/profile/profile.page"))
    },
    {
        auth: false,
        props: {
            path: '/privacy-policy',
        },
        component: () => "Privacy Policy"
    },
    {
        auth: false,
        props: {
            path: '/terms-of-service',
        },
        component: () => "Terms of Service"
    },
    {
        auth: true,
        props: {
            path: "/user-management",
            allowed: ["super", "admin", "owner"]
        },
        component: lazy(() => import("./pages/user-management/user-management.page"))
    },
    {
        auth: true,
        props: {
            path: "/group-management",
            allowed: ["super", "admin", "owner"]
        },
        component: lazy(() => import("./pages/group-management/group-management.page"))
    }
];