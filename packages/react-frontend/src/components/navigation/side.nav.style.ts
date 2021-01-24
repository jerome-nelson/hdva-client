import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useSidenavStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            width: `140px`,
            height: `44px`,
            marginBottom: `${theme.spacing(2)}px`
        },
        root: {
            backgroundColor: COLOR_OVERRIDES.hdva_white,
            width: `${theme.spacing(25)}px`,
            minWidth: `${theme.spacing(25)}px`,
        },
        listBtn: {
            borderRadius: `${theme.spacing(4)}px`,
            "&:hover": {
                background: `rgba(0,0,0, 0.05)`,
            },
        },
        selectedBtn: {
            background: `rgba(0,0,0, 0.05)`,
        },
        home: {
            color: COLOR_OVERRIDES.hdva_grey,
            "& .MuiTypography-body1": {
                fontSize: `1.1rem`
            }
        },
        nav: {
            marginTop: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px` 
        }
    })
);