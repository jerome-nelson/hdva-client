import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useLoginStyles = makeStyles((theme: Theme) =>
    createStyles({
        mdUpMargin: {
            marginTop: `${theme.spacing(2)}px`
        }
    }),
);