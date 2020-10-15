import { makeStyles, createStyles, Theme,  } from "@material-ui/core"

export const useCarouselStyles = makeStyles((theme: Theme) =>
createStyles({
    carousel: {
        position: "relative",
        overflow: "hidden"
    },
    carouselIndicator: {
        position: "relative",
        flex: "0 1 auto",
        width: "1.5em",
        height: "0.3em",
        margin: "0 0.3em",
        background: theme.shadows.toString(),
        cursor: "pointer",
        "&:hover": {
            background: theme.palette.secondary
        },
        "&.active": {
            background: theme.palette.primary,
            cursor: "pointer"
        }
    },
    carouselIndicators: {
        position: "absolute",
        right: "0",
        bottom: "0.5em",
        left: "0",
        zIndex: 15,
        display: "flex",
        justifyContent: "center",
        paddingLeft: "0",
        listStyle: "none",
        margin: "0 auto"
    },
    carouselContent: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        overflow: "hidden",
        position: "relative"
    },
    carouselItem: {
        width: "100%"
    }
}),
);