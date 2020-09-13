import React, { useState, useEffect } from "react";
import { RouteProps, Redirect, useLocation } from "react-router-dom";
import { BottomNav } from "../components/navigation/bottom.nav";
import { getCurrentUser } from "../services/auth.service";
import { Hidden, makeStyles, createStyles, Theme, Grid } from "@material-ui/core";
import { SideNav } from "components/navigation/side.nav";
import { useRoles } from "hooks/useRoles";

export interface RouterProps extends RouteProps {
  fullWidth?: boolean;
  auth?: boolean;
  allowed?: string[];
  component: any; // TODO: Type correctly
}

export const PrivateRoute = ({ auth, fullWidth, component, ...rest }: RouterProps) => {

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const permissions = rest && rest.allowed;

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const location = useLocation();
  const [, canAccess] = useRoles(currentUser, permissions);

  const DynamicComponent = component;
  //  TODO Fix redirects
  if (auth && !currentUser) {
    return <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  }

  // TODO: Show modal instead to explain no access allowed
  return !canAccess ? <div>You are not allowed to access this page</div> : (
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