import { CircularProgress, createStyles, Grid, Hidden, makeStyles, Theme } from "@material-ui/core";
import { LoginContext } from "components/login-form/login.context";
import React, { Suspense, useContext } from "react";
import { Redirect, RouteProps, useHistory, useLocation } from "react-router-dom";
import { ModalContext } from "../components/modal/modal.context";
import { BottomNav } from "../components/navigation/bottom.nav";
import { SideNav } from "../components/navigation/side.nav";
import { RoleTypes, useRoles } from "../hooks/useRoles";


export const useProtectedStyles = makeStyles((theme: Theme) => createStyles({
  sidebar: {
    maxWidth: `250px`
  },
  layout: {
   padding: `0 ${theme.spacing(3)}px`, 
  }
}));

// TODO: WRONG COMPONENT ARCHITECTURE. FIX
export interface RouterProps extends RouteProps {
  fullWidth?: boolean;
  auth?: boolean;
  allowed?: RoleTypes[];
  toRender: any; // TODO: Type correctly
}

export const PrivateRoute = ({ auth, fullWidth, toRender, allowed }: RouterProps) => {

  const { user } = useContext(LoginContext);
  const modalSettings = useContext(ModalContext);
  const classes = useProtectedStyles();
  
  const history = useHistory();
  const location = useLocation();
  const [, canAccess, isError] = useRoles(allowed);

  const isAuthCanView = auth && !user;
  const DynamicComponent = toRender;
  //  TODO Fix redirects
  if (isAuthCanView) {
    return <Redirect
      to={{
        pathname: "/login",
        state: { from: location }
      }}
    />
  }

  // TODO: Show modal instead to explain no access allowed
  // TODO: Show modal instead of error occurred

  if (isError) {
    modalSettings.updateMessage("Error Occurred");
    modalSettings.setModal(true);
    if (!canAccess) {
      history.go(-1);
    }
    // return null;
  }

  if (!canAccess) {
    modalSettings.updateMessage("You are not allowed to access this page");
    modalSettings.setModal(true);
    return null;
  }

  return (
    <React.Fragment>
      <Hidden smDown>
        <Grid container>
          {!fullWidth && user && (
            <Grid className={classes.sidebar} item xs>
              <SideNav />
            </Grid>
          )}
          <Grid className={classes.layout} item xs>
            <Suspense fallback={<CircularProgress color="secondary"/>}>
              <DynamicComponent />
            </Suspense>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Suspense fallback={<CircularProgress color="secondary"/>}>
          <DynamicComponent />
        </Suspense>
        {user && (<BottomNav />)}
      </Hidden>
    </React.Fragment>
  );
}