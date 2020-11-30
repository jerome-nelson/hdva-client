import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const usePropertyCardStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        backgroundColor: "#fff",
        marginRight: "1%",
        width: '80%', 
        // TODO: REMOVE ITEM WIDTH!!
    },
    title: {
        textAlign: "center",
        "& a": {
            color: "#000",
            textDecoration: "none"
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));