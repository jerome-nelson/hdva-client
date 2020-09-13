import React from "react";
import { makeStyles, Theme, createStyles, List, ListSubheader, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import FaceIcon from '@material-ui/icons/Face';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from "react-router-dom";
import { logout } from "../../services/auth.service";

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
            </List>
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