import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { Roles } from "hooks/useRoles";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Permissions } from "utils/permissions";
import { getCurrentUser, logout } from "../../services/auth.service";
import { useSettingsStyles } from "./settings.style";

// TODO: Replace hardcode with ROUTE file
export const Settings = () => {

    const location = useLocation();
    const classes = useSettingsStyles();
    const history = useHistory();

    // TODO: Create Global Context
    const [, setCurrentUser] = useState(getCurrentUser());

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <React.Fragment>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                className={classes.root}
            >
                <ListItem
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
                    disabled
                    button
                >
                    <ListItemText
                        classes={{
                            root: classes.listItem
                        }}
                        primary="Profile Settings" />
                </ListItem>
                <ListItem onClick={() => {
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