import { makeStyles, createStyles, Theme,  } from "@material-ui/core"

export const useSidenavStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `${theme.spacing(25)}px`,
            minWidth: `${theme.spacing(25)}px`,
        },
        nav: {
            marginTop: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px` 
        }
    })
);