import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStickyHeaderStyles = makeStyles((theme: Theme) =>
createStyles({
    stickyHeader: {
        position: "relative",
        height: "3rem",
    },
    stickyInner: {
        backgroundColor: theme.palette.background.paper,
        position: "fixed",
        top: "0",
        left: "0",
        right:"0",
        zIndex: 1
    }
}),
);