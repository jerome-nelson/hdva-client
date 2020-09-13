import React, { useState, useEffect } from "react";
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { makeStyles, createStyles, BottomNavigationAction, BottomNavigation, AppBar, Theme } from "@material-ui/core";

import { getCurrentUser, logout } from "../../services/auth.service";
import { useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            top: 'auto',
            bottom: 0,
        },
    }),
);


export const BottomNav = () => {

    const classes = useStyles();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return currentUser ? (
        <AppBar className={classes.appBar} position="fixed" color="primary">
            <BottomNavigation showLabels>
                <BottomNavigationAction onClick={() => { history.push("/") }} label="Dashboard" icon={<DashboardIcon />} />
                <BottomNavigationAction onClick={() => { history.push("/properties") }}  label="Properties" icon={<HomeWorkIcon />} />
                <BottomNavigationAction onClick={() => { history.push("/settings") }} label="Settings" icon={<SettingsIcon />} />
                <BottomNavigationAction onClick={() => {
                    logout();
                    history.go(0);
                }} label="Logout" icon={<ExitToAppIcon />} />
            </BottomNavigation>
        </AppBar>
    ) : null
};