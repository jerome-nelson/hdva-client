import React from "react";
import { Grid, makeStyles, Theme, createStyles, AppBar, Button, Hidden } from "@material-ui/core";
import { Link } from "react-router-dom";

import { LoginForm } from "../../components/login-form/login-form";
import { messages } from "../../languages/en";
import { HeaderTitle } from "components/header/header";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        [theme.breakpoints.up('md')]: {
            formHeader: {
                marginTop: `${theme.spacing(15)}px`
            },
        },
        hrHeader: {
            position: `relative`,
            marginTop: `${theme.spacing(2.5)}px`,
            marginBottom: `${theme.spacing(1.25)}px`,
            textAlign: `center`,
            clear: `both`,
            overflow: `hidden`,
            "&:before, &:after": {
                content: `""`,
                position: `relative`,
                width: `50%`,
                backgroundColor: `rgba(0,0,0,0.2)`,
                display: `inline-block`,
                height: `1px`,
                verticalAlign: `middle`,
            },
            "&::before": {
                right: `0.5em`,
                marginLeft: `-50%`
            },
            "&::after": {
                left: `0.5em`,
                marginRight: `-50%`
            },
        },
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
            <Hidden mdUp>
                <HeaderTitle disableBack title={messages["login.title"]} />
            </Hidden>
            <Grid container className={classes.formHeader} spacing={3}>
                <Hidden mdDown>
                    <Grid className={classes.logo} item md={6}>
                        <img alt="Logo" src="https://via.placeholder.com/350x397.png?text=Welcome+Image" />
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid className={classes.logo} item xs={12}>
                        <img alt="Logo" src="https://via.placeholder.com/300?text=HDVA+Logo" />
                    </Grid>
                </Hidden>
                <Grid item xs={12} md={6}>
                    <Grid item md={6}>
                        <Hidden mdDown>
                            <HeaderTitle disableBack title={messages["login.title"]} />
                        </Hidden>
                        <Hidden mdDown>
                            <p>{messages["login.no-account"]} <br /> {messages["login.inactive-account"]}</p>
                            <div className={classes.hrHeader}><span className="hr-label__text">or</span></div>
                        </Hidden>
                        <LoginForm />
                        <Hidden mdDown>
                        <p>Usage of this service is subject to our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>. By using this service you agree to our terms</p>
                        </Hidden>
                        <Hidden mdUp>
                            <sub>{messages["login.inactive-account"]}</sub>
                        </Hidden>
                    </Grid>
                </Grid>
            </Grid>
            <Hidden mdUp>
                <AppBar color="primary" className={classes.forgottenDetails} elevation={0} position="fixed">
                    <Link to="/forgotten-password"><Button size="large" color="primary">{messages["login.form.forgotten-password"]}</Button></Link>
                </AppBar>
            </Hidden>
        </React.Fragment>
    );
}