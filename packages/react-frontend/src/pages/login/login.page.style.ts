import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useLoginPageStyles = makeStyles((theme: Theme) =>
createStyles({
    [theme.breakpoints.up('md')]: {
        formHeader: {
            marginTop: `${theme.spacing(15)}px`
        },
    },
    hrHeader: {
        position: `relative`,
        marginTop: `${theme.spacing(2.5)}px`,
        marginBottom: `${theme.spacing(1.25)}px`,
        textAlign: `center`,
        clear: `both`,
        overflow: `hidden`,
        "&:before, &:after": {
            content: `""`,
            position: `relative`,
            width: `50%`,
            backgroundColor: `rgba(0,0,0,0.2)`,
            display: `inline-block`,
            height: `1px`,
            verticalAlign: `middle`,
        },
        "&::before": {
            right: `0.5em`,
            marginLeft: `-50%`
        },
        "&::after": {
            left: `0.5em`,
            marginRight: `-50%`
        },
    },
    logo: {
        marginTop: `${theme.spacing(3)}px`,
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
    }
}),
);