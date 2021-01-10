import { DashboardPage } from "./pages/dashboard/dashboard.page";
import { ForgottenEmailPage } from "./pages/forgotten-email/forgotten-email.page";
import { GroupPage } from "./pages/group-management/group-management.page";
import { LoginPage } from "./pages/login/login.page";
import { PasswordResetPage } from "./pages/password-reset/password-reset.page";
import { ProfilePage } from "./pages/profile/profile.page";
import { PropertiesPage } from "./pages/properties/properties.page";
import { PropertiesOverviewPage } from "./pages/property-overview/property-overview.page";
import { SettingsPage } from "./pages/settings/settings.page";
import { UserPage } from "./pages/user-management/user-management.page";

export const ROUTES = [
    {
        auth: true,
        exact: true,
        props: {
            path: '/',
        },
        component: DashboardPage
    },
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/login',
        },
        component: LoginPage
    },
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/forgotten-password',
        },
        component: ForgottenEmailPage
    },  
    {
        auth: false,
        fullWidth: true,
        props: {
            path: '/verification',
        },
        component: PasswordResetPage
    },
    {
        auth: true,
        props: {
            path: '/settings',
        },
        component: SettingsPage
    },  
    {
        auth: true,
        exact: true,
        props: {
            path: '/properties',
        },
        component: PropertiesOverviewPage
    },
    {
        auth: true,
        props: {
            path: '/properties/:id',
        },
        component: PropertiesPage
    },
    {
        auth: true,
        props: {
            path: '/profile-settings',
        },
        component: ProfilePage
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
        component: UserPage
    },
    {
        auth: true,
        props: {
            path: "/group-management",
            allowed: ["super", "admin", "owner"]
        },
        component: GroupPage
    }
];