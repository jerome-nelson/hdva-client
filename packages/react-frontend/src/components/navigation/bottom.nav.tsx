import { AppBar, BottomNavigation, BottomNavigationAction, Slide } from "@material-ui/core";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SettingsIcon from '@material-ui/icons/Settings';
import classNames from "classnames";
import { LoginContext } from "components/login-form/login.context";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { DELAY_MENU_ANIMATION } from "../../theme";
import { useBottomNavStyles } from "./bottom.nav.style";

export const BottomNav = () => {

    const { user } = useContext(LoginContext);
    const classes = useBottomNavStyles();
    const history = useHistory();
    const location = useLocation();
    const [showMenu, toggleMenu] = useState(true);

    useEffect(() => {
        const menuHide = setTimeout(() => {
            toggleMenu(false);
        }, DELAY_MENU_ANIMATION);

        return () => clearTimeout(menuHide);
    }, []);

    return user ? (
        <React.Fragment>
            <div className={`${classes.toggleMenu} ${classes.positionUp}`} onClick={() => toggleMenu(!showMenu)}>
                <KeyboardArrowUpIcon />
            </div>
            <Slide direction="up" in={showMenu}>
                <AppBar className={classes.appBar} position="fixed" color="transparent" elevation={0}>
                    <div className={classes.toggleMenu} onClick={() => toggleMenu(!showMenu)}>
                        <KeyboardArrowDownIcon />
                    </div>
                    <BottomNavigation showLabels>
                        <BottomNavigationAction
                            className={classNames({
                                [classes.activeLink]: location.pathname === "/"
                            })}
                            onClick={() => { history.push("/") }}
                            label="Dashboard"
                            icon={<DashboardIcon />}
                        />
                        <BottomNavigationAction
                            className={classNames({
                                [classes.activeLink]: location.pathname === "/properties"
                            })}
                            onClick={() => { history.push("/properties") }}
                            label="Properties"
                            icon={<HomeWorkIcon />}
                        />
                        <BottomNavigationAction
                            className={classNames({
                                [classes.activeLink]: location.pathname === "/settings"
                            })}
                            onClick={() => { history.push("/settings") }}
                            label="Settings"
                            icon={<SettingsIcon />}
                        />
                        <BottomNavigationAction
                            onClick={() => {
                                logout();
                                history.go(0);
                            }}
                            label="Logout"
                            icon={<ExitToAppIcon />}
                        />
                    </BottomNavigation>
                </AppBar>
            </Slide>
        </React.Fragment>
    ) : null
};