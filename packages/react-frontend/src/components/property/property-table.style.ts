import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { PropertyMiniTableProps, PropertyTableProps } from "components/property/property-table";
import { COLOR_OVERRIDES, STYLE_OVERRIDES, WIDTHS } from "theme";

export const useMiniTableStyles = makeStyles<Theme, PropertyMiniTableProps>((theme: Theme) => createStyles({
    root: {
        border: `1px solid ${COLOR_OVERRIDES.hdva_grey_light}`,
        height: `400px`,
        "&:focus": {
            boxShadow: `0 0 0 3px #99c6f3`,
        }
    },
    thumbnailWidth: {
        width: `40px`
    },
    lastTd: {
        textAlign: `right`
    }
}));

export const useTableStyles = makeStyles<Theme, PropertyTableProps>((theme: Theme) => createStyles({
    containerMod: {
        paddingTop: `${theme.spacing(4)}px`,
        paddingBottom: `${theme.spacing(4)}px`,
        textAlign: 'center',
    },
    smDown: {
        padding: `0 ${theme.spacing(1)}px`,
    },
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
        width: props => props.mini ? `200px` : `400px`,
        "& > a": {
            width: props => props.mini ? `200px` : `400px`,
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
            width: props => props.mini ? `${(STYLE_OVERRIDES.thumbnail + 10) / 2}px` : WIDTHS.imageCell
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