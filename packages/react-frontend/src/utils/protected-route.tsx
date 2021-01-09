import { Grid, Hidden } from "@material-ui/core";
import { LoginContext } from "components/login-form/login.context";
import React, { useContext } from "react";
import { Redirect, RouteProps, useHistory, useLocation } from "react-router-dom";
import { ModalContext } from "../components/modal/modal.context";
import { BottomNav } from "../components/navigation/bottom.nav";
import { SideNav } from "../components/navigation/side.nav";
import { useRoles } from "../hooks/useRoles";


export interface RouterProps extends RouteProps {
  fullWidth?: boolean;
  auth?: boolean;
  allowed?: string[];
  toRender: any; // TODO: Type correctly
}

export const PrivateRoute = ({ auth, fullWidth, toRender, ...rest }: RouterProps) => {

  const { user } = useContext(LoginContext);
  const history = useHistory();
  const modalSettings = useContext(ModalContext);
  const permissions = rest && rest.allowed;
  
  const location = useLocation();
  const [, canAccess, isError] = useRoles(permissions);

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
      history.goBack();
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