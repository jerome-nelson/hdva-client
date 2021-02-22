import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useUserStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperOverride: {
      paddingTop: `6px`,
      paddingBottom: `6px`,
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