import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, makeStyles, createStyles, Theme, Grid } from "@material-ui/core";

import {ROUTES} from "../../routing";
import { Settings } from "../../components/settings/settings";
import { getCurrentUser } from "../../services/auth.service";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `${theme.spacing(25)}px`,
            minWidth: `${theme.spacing(25)}px`,
        },
        nav: {
            marginTop: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px` 
        }
    })
);

export const SideNav = () => {
    
    const classes = useStyles();
    const history = useHistory();
    const [currentUser,] = useState(getCurrentUser());

    return currentUser ? (
        <Drawer
            variant="persistent"
            anchor="left"
            open={true}
        >
            <Grid className={classes.nav} container>
                <Grid xs={12}>
                    <img alt="Logo" src="https://via.placeholder.com/60?text=Ico" />
                </Grid>
            </Grid>
            <List  className={classes.root}>
                {[{
                    ...ROUTES[0],
                    name: "Home"
                }].map((text, index) => (
                    <ListItem onClick={() => history.push(text.props.path)} button key={text.name}>
                        <ListItemText primary={text.name} />
                    </ListItem>
                ))}
                <Settings />
            </List>
        </Drawer>
    ) : null
}