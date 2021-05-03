import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { HeaderProps } from "./header";


export const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: (props: HeaderProps) => (props.fixedHeight ? {
          height: props.fixedHeight,
        } : {}),
        paperReset: {
            boxShadow: "none",
            padding: 0,
        },
        root: {
            flexWrap: "wrap"
        },
        title: (props: HeaderProps) => ({
            width: props.disableBack ? "100%" : "inherit",
            height: `100%`,
            textAlign: props.alignText ? props.alignText : "center"
        })
    }),
);