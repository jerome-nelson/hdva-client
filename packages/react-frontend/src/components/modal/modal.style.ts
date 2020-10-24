import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useModalProviderStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridTxtAlignment: {
            textAlign: "center",
        },
        root: {
            position: "absolute",
            width: "100%",
            zIndex: 1
        },
        modal: {
            margin: "0 auto",
            width: "80%",
            padding: `${theme.spacing(2)}px 0`,
            [theme.breakpoints.up('md')]: {
                width: "40%"
            },
        },
        closeIcon: {
            cursor: "pointer",
            "&:hover": {
                opacity: "0.5",
            }
        },
        lastItem: {
            marginLeft: "auto"
        }
    })
);