import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import { Roles, useRoles } from "hooks/useRoles";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/auth.service";
import { useSettingsStyles } from "./settings.style";


export const Settings = () => {

    const classes = useSettingsStyles();
    const history = useHistory();
    const [, setCurrentUser] = useState(getCurrentUser());
    const [currentRole] = useRoles();

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
        {[Roles.super, Roles.admin, Roles.owner].includes(currentRole) &&  <List
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
                <ListItem button>
                    <ListItemText
                        classes={{
                            root: classes.listItem
                        }}
                        primary="Group Managment" />
                </ListItem>
            </List>}
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
                <ListItem button>
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