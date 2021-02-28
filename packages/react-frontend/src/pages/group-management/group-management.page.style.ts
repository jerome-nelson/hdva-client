import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useGroupStyle = makeStyles((theme: Theme) =>
    createStyles({
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