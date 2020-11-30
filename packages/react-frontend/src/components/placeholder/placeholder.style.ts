import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePlaceholderStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: `${theme.spacing(2)}px auto`,
            textAlign: "center",
            width: "100%"
        },
        icon: {
            background: "#b4d0e7",
            borderRadius: "50%",
            height: "10em",
            width: "10em",
            position: "relative",
            margin: "0 auto",

            "& span": {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }
        }
    }),
);