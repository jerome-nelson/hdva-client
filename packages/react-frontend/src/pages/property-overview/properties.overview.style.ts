import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePropertyOverviewStyles = makeStyles((theme: Theme) =>
    createStyles({
        navigationSelected: {
            // TODO: Is rgbToHex needed?
            backgroundColor: `rgba(0, 0, 0, 0.08)`
        },
        header: {
            padding: `12px`,
        },
        mobileBtn: {
            width: `90%`,
            margin:  `24px auto`,
            display: `block`,
        },
        root: {
            background: "transparent"
        }
    }));