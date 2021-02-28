import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useUserStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down("md")]: {
        marginTop: `70px`
      },
    },
    gridWidth: {
      width: "100%"
    },
    inputMargin: {
      margin: `10px 0`
    },
    paperOverride: {
      padding: `6px 0`
    },
    avatarLarge: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    btnOverride: {
      fontSize: `${theme.spacing(1.75)}px`,
      marginRight: `${theme.spacing(1)}px`
    },
    listItem: {
      paddingLeft: `${theme.spacing(2)}px`,
      "& .MuiTypography-colorTextSecondary": {
        color: COLOR_OVERRIDES.hdva_black
      }
    },
    paperInside: {
      padding: "0 12px"
    },
    variantBG: {
      // TODO: Wrap Skeleton and allow contrasting colours
      background: `rgba(0, 0, 0, 0.13)`,
      marginBottom: `10px`,
    },
    breadcrumb: {
      marginTop: `42px`,
      marginBottom: `20px`,
      "& .MuiBreadcrumbs-separator": {
        // TODO: Integrate into the theme
        fontSize: `1.5rem`
      }
    },
    link: {
      display: 'flex',
      fontSize: `1.5rem`
    },
    icon: {
      marginRight: theme.spacing(1),
      width: 27,
    },
    groupForm: {
      padding: `${theme.spacing(2)}px`
    }
  })
);