import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useProfileStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            position: `absolute`,
            top: '-80px',
            left: '50%',
            marginLeft: `-56px`,
        },
        container: {
            margin: `200px auto 0`,
            maxWidth: `400px`,
            width: `90%`,
            position: 'relative',
        },
        root: {
            paddingTop: `50px`,
            width: `100%`,
            marginTop: theme.spacing(3)
        }
    }));