import React from "react";
import {  Grid, makeStyles, Theme, createStyles, AppBar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import { LoginForm } from "../../components/login-form/login-form";
import { HeaderTitle } from "components/header/header";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            marginTop: `${theme.spacing(3)}px`,
            textAlign: 'center',
        },
        forgottenDetails: {
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            padding: theme.spacing(3),
            textAlign: "center",
            top: 'auto',
            bottom: 0,

            '& a': {
                textDecoration: 'none'
            }
        }
    }),
);

export const LoginPage = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <HeaderTitle disableBack title="Proceed with your Login" />
            <Grid container spacing={3}>
                <Grid className={classes.logo} item xs={12}>
                    <img alt="Logo" src="https://via.placeholder.com/300?text=HDVA+Logo" />
                </Grid>
                <Grid item xs={12}>
                    <LoginForm />
                </Grid>
            </Grid>
            <AppBar color="primary" className={classes.forgottenDetails} elevation={0} position="fixed">
                <Link to="/forgotten-password"><Button size="large" color="primary">Forgot password</Button></Link>
            </AppBar>
        </React.Fragment>
    );
}