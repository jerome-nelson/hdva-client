import { makeStyles, createStyles, Theme,  } from "@material-ui/core";

export const useErrorPopupStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            textDecoration: "none"
        }
    })
);