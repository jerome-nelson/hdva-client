import { Drawer, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import classNames from "classnames";
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Settings } from "../../components/settings/settings";
import { ROUTES } from "../../routing";
import { useSidenavStyles } from "./side.nav.style";

export const SideNav: React.FC = () => {

    const classes = useSidenavStyles();
    const location = useLocation();
    const history = useHistory();
    // const [showMenu, toggleMenu] = useState(true);

    return (
        <React.Fragment>
            {/* <div onClick={() => toggleMenu(!showMenu)}>
                <KeyboardArrowRightIcon />
            </div> */}
            {/* <Slide direction="right" in={showMenu}> */}
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={true}
                >

                    {/* <div onClick={() => toggleMenu(!showMenu)}>
                        <KeyboardArrowLeftIcon />
                    </div> */}
                    <Grid className={classes.nav} container>
                        <Grid item xs={12}>
                            <div className={classes.logo}>
                                <LogoSVG />
                            </div>
                        </Grid>
                    </Grid>
                    <List className={classes.root}>
                        {/* TODO: Why did I map this? */}
                        {[{
                            ...ROUTES[0],
                            name: "Home"
                        }].map((text, index) => {
                            return (
                                <ListItem className={classNames({
                                    [classes.listBtn]: true,
                                    [classes.selectedBtn]: location.pathname === text.props.path
                                })} disabled={location.pathname === text.props.path} onClick={() => history.push(text.props.path)} button key={text.name}>
                                    <ListItemText className={classes.home} primary={text.name} />
                                </ListItem>
                            );
                        })}
                        <Settings variant="light" />
                    </List>
                </Drawer>
            {/* </Slide> */}
        </React.Fragment>
    );
}