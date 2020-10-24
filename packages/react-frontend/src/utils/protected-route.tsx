import { Grid, Hidden } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteProps, useLocation } from "react-router-dom";
import { ModalContext } from "../components/modal/modal.context";
import { BottomNav } from "../components/navigation/bottom.nav";
import { SideNav } from "../components/navigation/side.nav";
import { useRoles } from "../hooks/useRoles";
import { getCurrentUser } from "../services/auth.service";


export interface RouterProps extends RouteProps {
  fullWidth?: boolean;
  auth?: boolean;
  allowed?: string[];
  toRender: any; // TODO: Type correctly
}

export const PrivateRoute = ({ auth, fullWidth, toRender, ...rest }: RouterProps) => {

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const modalSettings = useContext(ModalContext);
  const permissions = rest && rest.allowed;

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  
  const location = useLocation();
  const [, canAccess, isError] = useRoles(permissions);

  const DynamicComponent = toRender;
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
  // TODO: Show modal instead of error occurred

  if (isError) {
    modalSettings.updateMessage("Error Occurred");
    modalSettings.setModal(true);
    return null;
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