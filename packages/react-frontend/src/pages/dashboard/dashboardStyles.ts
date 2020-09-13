import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useDashboardStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            width: "80%",
            margin: `0 auto`
        },
        table: {
            width: "40%"
        },
        fullwidth: {
            textAlign: "center",
            width: "100%"
        },
        title: {
            marginTop: `${theme.spacing(3)}px`
        },
        subtitle: {
            width: '100%',
            fontFamily: `AtlasGrotesk, sans-serif`,
            borderBottom: `solid 1px rgba(0, 0, 0, 0.3)`,
            paddingBottom: `${theme.spacing(0.5)}px`,
            marginBottom: `${theme.spacing(1)}px`,
            '& h3': {
                margin: 0,
            },
        },
        media: {
            height: 140,
        },
        root: {
            maxWidth: 345,
            marginRight: '10px'
          },
    })
);