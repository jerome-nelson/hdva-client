import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePropertyOverviewStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            [theme.breakpoints.down("md")]: {
                marginTop: `70px`
            },
        },
        navigationSelected: {
            // TODO: Is rgbToHex needed?
            backgroundColor: `rgba(0, 0, 0, 0.08)`
        },
        breadcrumb: {
            marginTop: `42px`,
            marginBottom: `20px`,
            "& .MuiBreadcrumbs-separator": {
                // TODO: Integrate into the theme
                fontSize: `1.5rem`
            }
        },
        link: {
            display: 'flex',
            fontSize: `1.5rem`
        },
        icon: {
            marginRight: theme.spacing(1),
            width: 27,
        },
        header: {
            padding: `12px`,
        },
        mobileBtn: {
            width: `90%`,
            margin: `24px auto`,
            display: `block`,
        },
        root: {
            background: "transparent"
        }
    }));