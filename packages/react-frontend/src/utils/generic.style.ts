import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useGenericStyle = makeStyles((theme: Theme) =>
    createStyles({
        userFields: {
            borderRadius: `${theme.spacing(3)}px !important`,
            marginTop: `${theme.spacing(3)}px`,
        },
       actionButton: {
        padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
        marginTop: `${theme.spacing(3)}px`,
        borderRadius: `${theme.spacing(3)}px`
       }
    }),
);