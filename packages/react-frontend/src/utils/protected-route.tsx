import React, { useState, useEffect } from "react";
import { RouteProps, Redirect, useLocation } from "react-router-dom";
import { BottomNav } from "../components/navigation/bottom.nav";
import { getCurrentUser } from "../services/auth.service";

export interface RouterProps extends RouteProps {
  auth?: boolean;
  component: any; // Todo: Type correctly
}

export const PrivateRoute = ({ auth, component, ...rest }: RouterProps) => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
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
  return <React.Fragment>
    <DynamicComponent />
    <BottomNav />
  </React.Fragment>
}