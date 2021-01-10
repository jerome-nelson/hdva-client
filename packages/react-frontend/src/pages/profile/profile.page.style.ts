import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useProfileStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: `800px`,
            width: `90%`,
            marginTop: theme.spacing(3)
        }
    }));