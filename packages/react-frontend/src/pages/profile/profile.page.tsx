import { Hidden, Paper } from "@material-ui/core";
import { HeaderTitle } from "components/header/header";
import React from "react";
import { useProfileStyles } from "./profile.page.style";

export const ProfilePage: React.SFC = () => {
  const classes = useProfileStyles();
  return (
    <React.Fragment>
      <Hidden mdUp>
        <HeaderTitle title="Profile Settings" alignText="center" color="primary" variant="h5" />
      </Hidden>
      
      <Paper className={classes.root} color="secondary">
        Name: Jerome Nelson
        Email: jerome.nelson@skelia.com
        Role: Super User (what can you do?)
        * Part of Gordon and Co Team
        * You can access all groups
      </Paper>

    </React.Fragment>
  );
}