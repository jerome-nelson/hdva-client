import React, { useState, useEffect } from "react";
import { RouteProps, Redirect, useLocation } from "react-router-dom";
import { BottomNav } from "../components/navigation/bottom.nav";
import { getCurrentUser } from "../services/auth.service";
import { Hidden, makeStyles, createStyles, Theme, Grid } from "@material-ui/core";
import { SideNav } from "components/navigation/side.nav";

export interface RouterProps extends RouteProps {
  fullWidth?: boolean;
  auth?: boolean;
  component: any; // TODO: Type correctly
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      flexGrow: 1,
    }
  })
);

export const PrivateRoute = ({ auth, fullWidth, component, ...rest }: RouterProps) => {

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const classes = useStyles();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const location = useLocation();
  const DynamicComponent = component;
  // const componentToShow = (currentUser && location.pathname === "/login") ? <DashboardPage /> : children;
  //  TODO Fix redirects

  if (auth && !currentUser) {
    return <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  }

  return (
    <React.Fragment>
      <Hidden mdDown>
        <Grid container>
          {!fullWidth && (<Grid item md={2}>
            <SideNav />
          </Grid>)}
          <Grid item md={!fullWidth ? 10 : 12}>
            <DynamicComponent />
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <DynamicComponent />
        <BottomNav />
      </Hidden>
    </React.Fragment>
  );
}