import { makeStyles, createStyles, Theme,  } from "@material-ui/core";

import { HeaderProps } from "./header";

export const useHeaderStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxShadow: "none",
        },
        title: (props: HeaderProps) => ({
            flexGrow: 1,
            padding: `${theme.spacing(1)}px 0`,
            textAlign: props.alignText ? props.alignText : "center"
        })
    }),
);