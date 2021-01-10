import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import classNames from "classnames";
import { Roles } from "hooks/useRoles";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Permissions } from "utils/permissions";
import { logout } from "../../services/auth.service";
import { useSettingsStyles } from "./settings.style";

// TODO: Add logout to login.context

// TODO: Replace hardcode with ROUTE file
export interface SettingsProps {
    variant?: "light" | "dark";
}

export const Settings: React.SFC<SettingsProps> = ({ variant }) => {

    const location = useLocation();
    const classes = useSettingsStyles({ variant });
    const history = useHistory();

    return (
        <React.Fragment>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                <ListItem
                    className={classNames({
                        [classes.listBtn]: variant === "light",
                        [classes.selectedBtn]: location.pathname === "/properties"
                    })}
                    button
                    disabled={location.pathname === "/properties"}
                    onClick={() => {
                        history.push("/properties")
                    }}
                >
                    <ListItemText
                        classes={{
                            root: classes.listItem
                        }}
                        primary="Properties"
                    />
                </ListItem>
            </List>
            <Permissions showOn={[Roles.super, Roles.admin, Roles.uploader]}>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader className={classes.listHeader} component="div" id="nested-list-subheader">
                            Management Settings
                    </ListSubheader>
                    }
                    className={classes.root}
                >
                    <ListItem
                        className={classNames({
                            [classes.listBtn]: variant === "light",
                            [classes.selectedBtn]: location.pathname === "/user-management"
                        })}
                        button
                        disabled={location.pathname === "/user-management"}
                        onClick={() => {
                            history.push("/user-management")
                        }}
                    >
                        <ListItemText
                            classes={{
                                root: classes.listItem
                            }}
                            primary="User Management" />
                    </ListItem>
                    <ListItem
                        className={classNames({
                            [classes.listBtn]: variant === "light",
                            [classes.selectedBtn]: location.pathname === "/group-management"
                        })}
                        button
                        disabled={location.pathname === "/group-management"}
                        onClick={() => {
                            history.push("/group-management")
                        }}>
                        <ListItemText
                            classes={{
                                root: classes.listItem
                            }}
                            primary="Group Managment" />
                    </ListItem>
                </List>
            </Permissions>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader className={classes.listHeader} component="div" id="nested-list-subheader">
                        Personal Settings
                    </ListSubheader>
                }
                className={classes.root}
            >
                <ListItem
                    className={classNames({
                        [classes.listBtn]: variant === "light",
                        [classes.selectedBtn]: location.pathname === "/profile-settings"
                    })}
                    disabled={location.pathname === "/profile-settings"}
                    onClick={() => {
                        history.push("/profile-settings")
                    }}
                    button
                >
                    <ListItemText
                        classes={{
                            root: classes.listItem
                        }}
                        primary="Profile Settings" />
                </ListItem>
                <ListItem
                    className={classNames({
                        [classes.listBtn]: variant === "light"
                    })}
                    onClick={() => {
                        logout();
                        history.go(0);
                    }} button key="logout">
                    <ListItemText
                        classes={{
                            root: classes.listItem
                        }}
                        primary="Logout" />
                </ListItem>
            </List>
        </React.Fragment>
    )
}