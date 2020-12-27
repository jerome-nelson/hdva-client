import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useErrorPopupStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: `${theme.spacing(2)}px`
        },
        link: {
            textDecoration: "none"
        }
    })
);