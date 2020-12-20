import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { HeaderProps } from "./header";


export const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        reset: {
            boxShadow: "none"
        },
        paperReset: {
            padding: 0,
        },
        root: {
            flexWrap: "wrap"
        },
        title: (props: HeaderProps) => ({
            width: props.disableBack ? "100%" : "inherit",
            textAlign: props.alignText ? props.alignText : "center"
        })
    }),
);