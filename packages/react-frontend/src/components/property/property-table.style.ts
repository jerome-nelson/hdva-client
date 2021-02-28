import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES, WIDTHS } from "theme";

export const useTableStyles = makeStyles((theme: Theme) => createStyles({
    pagination: {
        position: `fixed`,
        left: `55%`,
        bottom: `0%`,
        transform: `translate(-50%, -10%)`,
        zIndex: 1,
        [theme.breakpoints.down("sm")]: {
            bottom: `50px`,
        }
    },
    media: {
        "& > div": {
            display: 'flex',
            '& > *': {
              margin: theme.spacing(1),
            },
        }
    },
    hideOnMobile: {
        [theme.breakpoints.down("xs")]: {
            display: `none`
        }
    },
    nameCellContainer: {
        width: `400px`,
        "& > a": {
            width: `400px`,
            display: `block`,
            overflow: `hidden`,
            whiteSpace: `nowrap`,
            textOverflow: `ellipsis`,
            textDecoration: `none`,
            // TODO: How to set Link style globally for secondary theme
            color: COLOR_OVERRIDES.hdva_white
        }
    },
    imageCell: {
        "&, & > div": {
            width: WIDTHS.imageCell
        }
    },
    moreCell: {
        textAlign: `center`,
    },
    // TODO: Insert into Theme Directly
    tableHeadCell: {
        fontSize: `0.8rem`,
        fontWeight: `bolder`,
        paddingBottom: `${theme.spacing(1)}px`
    }
}));