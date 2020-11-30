import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useCarouselStyles = makeStyles((theme: Theme) =>
    createStyles({
        arrowIcon: {
            background: "#b4d0e7",
            borderRadius: "50%",
            height: "5em",
            width: "5em",
            position: "relative",
            margin: "0 auto",
            "& *": {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }
        }
    }),
);