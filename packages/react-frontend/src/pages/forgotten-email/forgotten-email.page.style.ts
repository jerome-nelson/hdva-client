import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useForgottenStyles = makeStyles((theme: Theme) => createStyles({
    [theme.breakpoints.up('md')]: {
        formHeader: {
            marginTop: `${theme.spacing(15)}px`
        },
    },
    logo: {
        margin: `${theme.spacing(3)}px 0`,
        textAlign: 'center',
    },
    forgottenDetails: {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        padding: theme.spacing(3),
        textAlign: "center",
        top: 'auto',
        bottom: 0,

        '& a': {
            textDecoration: 'none'
        }
    },
    emailForm: {
        width: "100%"
    },
    userField: {
        borderRadius: `${theme.spacing(3)}px`,
        marginTop: `${theme.spacing(3)}px`,
    },
    submitBtn: {
        padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
        marginTop: `${theme.spacing(3)}px`,
        borderRadius: `${theme.spacing(3)}px`
    },
    mdUpMargin: {
        marginLeft: `auto`,
        marginTop: `${theme.spacing(2)}px`
    },
    title: {
        marginTop: `${theme.spacing(10)}px`,
        padding: `${theme.spacing(1)}px 0`,
    },
    description: {
        margin: 0
    }
}));