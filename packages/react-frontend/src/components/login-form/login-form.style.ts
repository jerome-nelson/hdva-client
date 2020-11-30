import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useLoginStyles = makeStyles((theme: Theme) =>
    createStyles({
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