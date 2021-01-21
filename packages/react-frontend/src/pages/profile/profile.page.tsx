import { Avatar, CircularProgress, Hidden, Paper, Typography } from "@material-ui/core";
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { messages } from "config/en";
import { getAPI } from "hooks/useAPI";
import { Roles, useRoles } from "hooks/useRoles";
import React, { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { User } from "services/auth.service";
import { useGenericStyle } from "utils/generic.style";
import { Permissions } from "utils/permissions";
import { useProfileStyles } from "./profile.page.style";

export const ProfilePage: React.SFC = () => {

  const { user } = useContext(LoginContext);
  
  const { isLoading, isSuccess, data: userData, refetch } = useQuery({
    queryKey: "profile",
    enabled: false,
    queryFn: () => getAPI<User>(`/get-user`, { token: user && user.token })
  });

  const [currentRole] = useRoles();
  const classes = useProfileStyles();
  const genericClasses = useGenericStyle();

  useEffect(() => {
    refetch()
  }, [refetch, user]);

  return (
    <React.Fragment>
      <Hidden mdUp>
        <HeaderTitle title="Profile Settings" alignText="center" color="primary" variant="h5" />
      </Hidden>

      <div className={classes.container}>
        <Avatar className={`${classes.avatar} ${genericClasses.largeAvatar}`}>
          {userData && userData[0] && userData[0].name.slice(0, 1)}
        </Avatar>
        <Paper className={classes.root} color="secondary">
          {isLoading && currentRole ? <CircularProgress /> :
            (
              <form>

                <Typography color="primary" variant="h6">
                  Name
                </Typography>
                <Typography variant="h6">
                  {userData && userData[0] && userData[0].name}
                </Typography>
                <Typography color="primary" variant="h6">
                  Email
                </Typography>
                <Typography variant="h6">
                  {userData && userData[0] && userData[0].email}
                </Typography>
                <Typography color="primary" variant="h6">
                  Role
                </Typography>
                <Typography variant="h6">
                  {currentRole}
                </Typography>
              </form>
            )}
          <Permissions showOn={[Roles.super]}>
            <blockquote>
              {messages[`roles.${currentRole.toLowerCase()}`]}
            </blockquote>
          </Permissions>
        </Paper>
      </div>
    </React.Fragment>
  );
}