import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { STYLE_OVERRIDES } from "theme";

export const usePropertyStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableHeadCell: {
            fontSize: `0.8rem`,
            fontWeight: `bolder`,
            paddingBottom: `${theme.spacing(1)}px`
        },
        variantBG: {
            background: `rgba(0, 0, 0, 0.13)`,
            marginBottom: `10px`,
        },
        photoBG: {
            height: 300,
            width: 400
        },
        breadcrumb: {
            marginTop: `42px`,
            marginBottom: `20px`,
            "& .MuiBreadcrumbs-separator": {
                // TODO: Integrate into the theme
                fontSize: `1.5rem`
            }
        },
        sidePanel: {
            position: `fixed`,
            top: 0,
            right: 0,
            height: `100%`,
            width: `500px`
        },
        link: {
            display: 'flex',
            fontSize: `1.5rem`
        },
        icon: {
            marginRight: theme.spacing(1),
            width: 27,
        },
        iconBg: {
            float: "left",
            padding: `1px`,
            // Makes images look like photo
            width: `${STYLE_OVERRIDES.thumbnail - 10}px`,
            textAlign: "center",
            // "& svg > g": {
            //     fill: "black",
            //     stroke: "black"
            // }
        },
        iconTableCell: {
            width: `${STYLE_OVERRIDES.thumbnail + 10}px`
        },
        breadcrumbs: {
            marginTop: theme.spacing(3)
        }
    }));