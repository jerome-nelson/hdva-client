import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useLazyLoadStyles = makeStyles((theme: Theme) =>
    createStyles({
        defaultImage: {
            display: "block",
            height: "100%",
            width: "100%"
        }
    }));