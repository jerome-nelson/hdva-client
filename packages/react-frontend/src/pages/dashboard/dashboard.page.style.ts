import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useDashboardStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            width: "30%",
            padding: `${theme.spacing(1)}px`
        }
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