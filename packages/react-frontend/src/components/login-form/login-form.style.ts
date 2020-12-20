import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useLoginStyles = makeStyles((theme: Theme) =>
    createStyles({
        mdUpMargin: {
            marginTop: `${theme.spacing(2)}px`
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

    }),
);