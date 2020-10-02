import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles, List, ListSubheader, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { logout, getCurrentUser } from "../../services/auth.service";
import { useRoles, Roles } from "hooks/useRoles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        listItem: {
            "& span": {
                fontSize: '1.1rem',
            }
        },
        listHeader: {
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '12px',
            marginTop: '20px',
            marginBottom: '10px'
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

export const Settings = () => {

    const classes = useStyles();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [currentRole] = useRoles(currentUser);

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