import { makeStyles, createStyles, Theme,  } from "@material-ui/core";

export const usePropertyCardStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        backgroundColor: "#fff",
        marginRight: "1%",
        width: '30%',
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