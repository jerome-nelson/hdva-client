import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePropertyOverviewStyles = makeStyles((theme: Theme) =>
    createStyles({
        navigationSelected: {
            // TODO: Is rgbToHex needed?
            backgroundColor: `rgba(0, 0, 0, 0.08)`
        },
        root: {
            background: "transparent"
        }
    }));