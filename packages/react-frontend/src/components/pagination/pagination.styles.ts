import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES, STYLE_OVERRIDES } from "theme";

export const usePaginationStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: 0,
        "& > ul": {
            overflow: "hidden",
            padding: `${theme.spacing(0.5)}px 0`,
            display: "flex",
            listStyle: "none",
            justifyContent: "center",
            "& > li": {
                margin: `0 10px`,
                
                "&:first-child": {
                    marginLeft: 0
                },
                "&:last-child": {
                    marginRight: 0
                }
            }
        }
    },
    button: {
        fontWeight: `bold`,
        fontSize: `${theme.spacing(2)}px`,
        borderRadius: `${theme.spacing(0.8)}px`,
        border: `none`,
        height: `${STYLE_OVERRIDES.thumbnail}px`,
        background: `transparent`,
        cursor: `pointer`,
        width: `${STYLE_OVERRIDES.thumbnail/1.75}px`,
        "&:focus": {
            outline: `none`,
        }
    },
    seperator: {
        height: `${STYLE_OVERRIDES.thumbnail}px`,        
        paddingTop: `${(STYLE_OVERRIDES.thumbnail/2) - 2}px`,
        lineHeight: 0,
        textAlign: `center`,
    },
    iconBtn: {
        width: `${STYLE_OVERRIDES.thumbnail}px`
    },
    btnSelected: {
        background: COLOR_OVERRIDES.hdva_red,
        color: COLOR_OVERRIDES.hdva_white
    }
}));