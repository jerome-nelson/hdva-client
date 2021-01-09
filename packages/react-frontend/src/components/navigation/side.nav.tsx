import { Drawer, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { LoginContext } from "components/login-form/login.context";
import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Settings } from "../../components/settings/settings";
import { ROUTES } from "../../routing";
import { useSidenavStyles } from "./side.nav.style";


export const SideNav: React.FC = () => {

    const classes = useSidenavStyles();
    const location = useLocation();
    const history = useHistory();
    const { user } = useContext(LoginContext);

    return user ? (
        <Drawer
            variant="persistent"
            anchor="left"
            open={true}
        >
            <Grid className={classes.nav} container>
                <Grid item xs={12}>
                    <img alt="Logo" src="https://via.placeholder.com/60?text=Ico" />
                </Grid>
            </Grid>
            <List className={classes.root}>
                {/* TODO: Why did I map this? */}
                {[{
                    ...ROUTES[0],
                    name: "Home"
                }].map((text, index) => {
                    return (
                        <ListItem className={classes.home} disabled={location.pathname === text.props.path} onClick={() => history.push(text.props.path)} button key={text.name}>
                            <ListItemText primary={text.name} />
                        </ListItem>
                    );
                })}
                <Settings variant="light" />
            </List>
        </Drawer>
    ) : null
}