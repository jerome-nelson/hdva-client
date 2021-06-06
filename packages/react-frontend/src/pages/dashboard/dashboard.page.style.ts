import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useDashboardStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            width: "90%",
            margin: `75px auto 0`,
            [theme.breakpoints.down("md")]: {
                marginTop: `90px`
            },
        },
        table: {
            width: "90%",
            margin: `0 auto`
        },
        logo: {
            height: "100%",
            padding: `${theme.spacing(1.5)}px`
        },
        infoText: {
            border: `solid 1px ${COLOR_OVERRIDES.hdva_white}`,
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            margin: `${theme.spacing(2)}px 0`,
            "& > div": {
                flexGrow: 1,
            }
        },
        btnNav: {
            padding: `${theme.spacing(2)}px 0`
        },
        moreLink: {
            padding: `${theme.spacing(1)}px 0`,
            textAlign: "right"
        },
        // container: {
        //     width: "80%",
        //     margin: `0 auto`
        // },
        // linkStyle: {
        //     display: "block",
        //     marginTop: `${theme.spacing(3)}px`,
        //     width: "100%",
        //     "&:hover": {
        //         textDecoration: "none",
        //     },
        // },
        // table: {
        //     width: "40%"
        // },
        // fullwidth: {
        //     textAlign: "center",
        //     width: "100%"
        // },
        // title: {
        //     marginTop: `${theme.spacing(3)}px`
        // },
        // subtitle: {
        //     width: '100%',
        //     fontFamily: `AtlasGrotesk, sans-serif`,
        //     borderBottom: `solid 1px rgba(0, 0, 0, 0.3)`,
        //     paddingBottom: `${theme.spacing(0.5)}px`,
        //     marginBottom: `${theme.spacing(1)}px`,
        //     '& h3': {
        //         margin: 0,
        //         color: COLOR_OVERRIDES.hdva_red
        //     },
        // },
        // media: {
        //     height: 140,
        // },
        // root: {
        //     maxWidth: 345,
        //     marginRight: '10px'
        //   },
    })
);