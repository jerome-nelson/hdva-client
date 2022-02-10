import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import classNames from "classnames";
import { FileContext, FileUpload, FileUploadRef, UPLOAD_STATE } from "components/upload/upload.context";
import { messages } from "config/en";
import { Roles } from "hooks/useRoles";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Permissions } from "utils/permissions";
import { logout } from "../../services/auth.service";
import { useSettingsStyles } from "./settings.style";


// TODO: Add logout to login.context

// TODO: Replace hardcode with ROUTE file
export interface SettingsProps {
    variant?: "light" | "dark";
}

export const Settings: React.FC<SettingsProps> = ({ variant }) => {
    const location = useLocation();
    const fileContext = useContext(FileContext);
    const classes = useSettingsStyles({ variant });
    const history = useHistory();
    // const UploadPopup = lazy(() => import("../../components/upload/upload-popup"));

    return (
        <React.Fragment>
           <FileUpload />
            {/* <Suspense fallback={false}>
                <Permissions showOn={[Roles.super, Roles.admin, Roles.uploader]}>
                    {showPopup && <UploadPopup />}
                </Permissions>
            </Suspense> */}
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
                        })}
                        disabled={fileContext.status !== UPLOAD_STATE.READY}
                        button
                        onClick={() => {
                            if (FileUploadRef?.current) {
                                FileUploadRef?.current.click();
                            }
                        }}
                    >
                        <ListItemText
                            classes={{
                                root: classes.listItem
                            }}
                            primary={messages["upload.button.cta"]} />
                    </ListItem>
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