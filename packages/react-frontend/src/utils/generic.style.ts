import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "../theme";

export const useGenericStyle = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: `100%`,
        },
        userFields: {
            marginTop: `${theme.spacing(3)}px`,
        },
        linkColor: {
            // ...STYLE_OVERRIDES.button.main,
            color: COLOR_OVERRIDES.hdva_white,
            fontWeight: "lighter"
        },
        actionButton: {
            padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
            marginTop: `${theme.spacing(3)}px`,
            borderRadius: `${theme.spacing(3)}px`
        },
        largeAvatar: {
            fontSize: `${theme.spacing(7)}px`,
            width: `${theme.spacing(14)}px`,
            height: `${theme.spacing(14)}px`,
        }
    }),
);