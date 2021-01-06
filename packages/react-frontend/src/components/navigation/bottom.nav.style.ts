import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useBottomNavStyles = makeStyles((theme: Theme) =>
    createStyles({
        activeLink: {
            color: COLOR_OVERRIDES.hdva_red
        },
        positionUp: {
            position: `fixed`,
            bottom: `0`,
            left: `50%`,
            marginLeft: `-25px`,
        },
        toggleMenu: {
            "& .MuiSvgIcon-root": {
                cursor: "pointer",
                background: COLOR_OVERRIDES.hdva_black_mid,
                width: `50px`,
                borderRadius: `4px 4px 0 0`
            },
            height: `24px`,
            textAlign: `center`,
        },
        appBar: {
            padding: 0,
            top: 'auto',
            bottom: 0,
        },
    }),
);