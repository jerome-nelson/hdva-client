import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useForgottenStyles = makeStyles((theme: Theme) => createStyles({
    foregroundBg: {
        background: COLOR_OVERRIDES.hdva_white
    },
    logo: {
        margin: `${theme.spacing(3)}px 0`,
        textAlign: 'center',
    },
    forgottenDetails: {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        padding: `0 0 ${theme.spacing(3)}px`,
        [theme.breakpoints.up('sm')]: {
            padding: 0,
        },
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
    formMaxWidth: {
        width: `455px`
    },
    desktopForm: {
        top: `50%`,
        left: `50%`,
        position: `absolute`,
        transform: `translate(-50%, -50%)`,
        width: `600px`
    },
    userField: {
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
        margin: `0 auto`,
        padding: `${theme.spacing(1)}px 0`,
    },
    description: {
        color: COLOR_OVERRIDES.hdva_black,
        margin: 0
    }
}));