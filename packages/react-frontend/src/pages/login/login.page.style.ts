import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { STYLE_OVERRIDES } from "theme";

export const useLoginPageStyles = makeStyles((theme: Theme) =>
createStyles({
    [theme.breakpoints.up('md')]: {
        formHeader: {
            marginTop: `${theme.spacing(15)}px`
        },
    },
    formMaxWidth: {
        width: `455px`,
        margin: `0 auto`,
        [theme.breakpoints.up('md')]: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: `650px`
        },
    },
    footerLink: {
        marginTop: `${theme.spacing(2)}px`
    },
    logo: {
        margin: `${theme.spacing(3)}px 0`,

        "& > div": {
            margin: `0 auto`,
            width: `${STYLE_OVERRIDES.logo.width}px`,
            height: `${STYLE_OVERRIDES.logo.height}px`
        }
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
    }
}),
);