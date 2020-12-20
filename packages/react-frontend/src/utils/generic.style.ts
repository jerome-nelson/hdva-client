import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES, STYLE_OVERRIDES } from "../theme";

export const useGenericStyle = makeStyles((theme: Theme) =>
    createStyles({
        userFields: {
            borderRadius: `${theme.spacing(3)}px !important`,
            marginTop: `${theme.spacing(3)}px`,
        },
        linkColor: {
            ...STYLE_OVERRIDES.button.main,
            color: COLOR_OVERRIDES.hdva_white,
            fontWeight: "lighter"
        },
        actionButton: {
            padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
            marginTop: `${theme.spacing(3)}px`,
            borderRadius: `${theme.spacing(3)}px`
        }
    }),
);