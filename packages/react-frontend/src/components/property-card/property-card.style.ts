import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePropertyCardStyles = (itemWidth: number) => makeStyles((theme: Theme) =>
createStyles({
    root: {
        backgroundColor: "#fff",
        padding: 0,
        width: itemWidth,
        "& a": {
            color: "#000",
            textDecoration: "none"
        }
    },
    title: {
        textAlign: "center",
    }
}));