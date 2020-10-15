import { makeStyles, createStyles, Theme,  } from "@material-ui/core";

export const useSettingsStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        "& span": {
            fontSize: '1.1rem',
        }
    },
    listHeader: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '12px',
        marginTop: '20px',
        marginBottom: '10px'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}),
);