import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "../../theme";

export const useFullScreenStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: `absolute`,
            height: `100%`,
            width: `100%`,
            backgroundColor: COLOR_OVERRIDES.hdva_white
        }
    })
);