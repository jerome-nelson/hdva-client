import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { STYLE_OVERRIDES } from "theme";

export const useContainerStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        position: `absolute`,
        top: 0,
        left: 0,
        height: `100%`,
        width: `100%`
    }
}));

export const useLoginPageStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
                backgroundColor: "#fff",
        },
        // [theme.breakpoints.up('md')]: {
        //     formHeader: {
        //         marginTop: `${theme.spacing(15)}px`
        //     },
        // },
        formMaxWidth: {
            width: `455px`,
            margin: `0 auto`,
            backgroundColor: `#fff`,
            [theme.breakpoints.down('md')]: {
                boxShadow: `none`
            //     position: "absolute",
            //     top: "50%",
            //     transform: "translateY(-50%)",
            //     maxWidth: `650px`
            },
        },
        footerLink: {
            marginTop: `${theme.spacing(2)}px`
        },
        logo: {
            margin: `0`,
            width: `140px`,
            top: `-20%`,
            left: `50%`,
            position: `absolute`,
            maxWidth: `${STYLE_OVERRIDES.logo.width}px`,
            transform: `translateX(-50%)`
        },
        forgottenDetails: {
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            padding: theme.spacing(3),
            textAlign: "center",
            top: '50%',
            transform: `translateY(-50%)`,
            '& a': {
                textDecoration: 'none'
            }
        }
    }),
);