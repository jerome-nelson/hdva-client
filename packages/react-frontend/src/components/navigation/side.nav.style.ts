import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useSidenavStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: COLOR_OVERRIDES.hdva_white,
            width: `${theme.spacing(25)}px`,
            minWidth: `${theme.spacing(25)}px`,
        },
        home: {
            color: COLOR_OVERRIDES.hdva_grey,
            fontSize: `1.1rem`
        },
        nav: {
            marginTop: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px` 
        }
    })
);