import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useGroupStyle = makeStyles((theme: Theme) =>
    createStyles({
      groupForm: {
          padding: `${theme.spacing(2)}px`
      }
    })
);