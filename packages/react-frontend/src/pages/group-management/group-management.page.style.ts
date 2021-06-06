import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { COLOR_OVERRIDES } from "theme";

export const useGroupStyle = makeStyles((theme: Theme) =>
    createStyles({
      container: {
        [theme.breakpoints.down("md")]: {
          marginTop: `70px`
        },
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
      gridWidth: {
        width: "100%"
      },
      inputMargin: {
        margin: `10px 0`
      },
      groupForm: {
          padding: `${theme.spacing(2)}px`
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
      }    
    })
);