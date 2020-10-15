import { makeStyles, createStyles, Theme,  } from "@material-ui/core";

export const useLoginStyles = makeStyles((theme: Theme) =>
    createStyles({
        userFields: {
            borderRadius: `${theme.spacing(3)}px`,
            marginTop: `${theme.spacing(3)}px`,
        },
        submitBtn: {
            padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
            marginTop: `${theme.spacing(3)}px`,
            borderRadius: `${theme.spacing(3)}px`
        },
        mdUpMargin: {
            marginTop: `${theme.spacing(2)}px`
        }
    }),
);