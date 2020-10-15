import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const usePropertyStyles = makeStyles((theme: Theme) =>
    createStyles({
        breadcrumbs: {
            marginTop: theme.spacing(3)
        }
    }));