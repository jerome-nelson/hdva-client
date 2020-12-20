import { AppBar, Grid, Hidden } from "@material-ui/core";
import { LoginForm } from "components/login-form/login-form";
import React from "react";
import { Link } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { accessibility } from "../../languages/accessibility";
import { messages } from "../../languages/en";
import { useLoginPageStyles } from "./login.page.style";


export const LoginPage = () => {
    const classes = useLoginPageStyles();
    const genericClasses = useGenericStyle();
    return (
        <React.Fragment>
            <Grid container className={classes.formHeader}>
                <Hidden mdDown>
                    <Grid className={classes.logo} item md={6}>
                        <img {...accessibility.logoIMG} src="https://hdva-image-bucket-web.s3.amazonaws.com/logo-mobile.png" />
                    </Grid>
                    <Grid item md={6}>
                        <LoginForm className={classes.formMaxWidth}/>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid className={classes.logo} item xs={12}>
                        <img {...accessibility.logoIMG} src="https://hdva-image-bucket-web.s3.amazonaws.com/logo-mobile.png" />
                    </Grid>
                </Hidden>
            </Grid>
            <Hidden mdUp>
                <AppBar color="primary" className={classes.forgottenDetails} elevation={0} position="fixed">
                    <Grid container className={classes.formHeader}>
                        <Grid item xs={12}>
                            <LoginForm className={classes.formMaxWidth} />
                            <Hidden mdDown>
                                <p>Usage of this service is subject to our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>. By using this service you agree to our terms</p>
                            </Hidden>
                            {/* <Hidden mdUp>
                                <sub>{messages["login.inactive-account"]}</sub>
                            </Hidden> */}
                        </Grid>

                    </Grid>
                    <Link className={`${genericClasses.linkColor} ${classes.footerLink}`} to="/forgotten-password">{messages["login.form.forgotten-password"]}</Link>
                </AppBar>
            </Hidden>
        </React.Fragment>
    );
}