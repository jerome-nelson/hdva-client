import { AppBar, Button, CircularProgress, Grid, Hidden, OutlinedInput, Typography } from "@material-ui/core";
import { accessibility } from "config/accessibility";
import { useAPI } from "hooks/useAPI";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { HeaderTitle } from "../../components/header/header";
import { messages } from "../../config/en";
import { useForgottenStyles } from "./forgotten-email.page.style";


export const ForgottenEmailPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [data, , , callAPI] = useAPI("/forgotten-password");
    const classes = useForgottenStyles();
    const notAllFieldsFilled = !email;

    const genericClasses = useGenericStyle();

    return (
        <React.Fragment>
            <Grid container className={classes.formHeader}>

                <Hidden mdDown>
                    <Grid className={classes.logo} item md={6}>
                        <HeaderTitle
                            title={
                                <img {...accessibility.logoIMG} src="https://hdva-image-bucket-web.s3.amazonaws.com/logo-mobile.png" />
                            } />
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid className={classes.logo} item xs={12}>
                        <HeaderTitle
                            title={
                                <img {...accessibility.logoIMG} src="https://hdva-image-bucket-web.s3.amazonaws.com/logo-mobile.png" />
                            } />
                    </Grid>
                </Hidden>
            </Grid>
            <Hidden mdUp>
                <AppBar color="primary" className={classes.forgottenDetails} elevation={0} position="fixed">
                    <Grid container className={classes.formHeader}>
                        <Typography className={classes.title} variant="h6">
                            {messages["forgotten-password.title"]}
                        </Typography>
                        <p className={classes.description}>{messages["forgotten-password.description"]}</p>

                        <form className={classes.emailForm} onSubmit={() => {
                            setTimeout(() => {
                                callAPI({
                                    email
                                })
                            })
                        }}>
                            <Grid container>
                                <OutlinedInput
                                    className={classes.userField}
                                    fullWidth={true}
                                    value={email}
                                    placeholder={messages["forgotten-password.form.email"]}
                                    id="email"
                                    onChange={event => setEmail(event.target.value)}
                                    type="text"
                                />
                            </Grid>
                            <Grid container justify="flex-start">
                                <Grid md={6} item className={classes.mdUpMargin}>
                                    <Button disabled={notAllFieldsFilled} type="submit" className={classes.submitBtn} fullWidth size="large" variant="outlined" color="primary">
                                        {data.isLoading ? <CircularProgress size="1.5rem" color="secondary" /> : (notAllFieldsFilled ? "Fill in all fields" : "Submit")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Link className={genericClasses.linkColor} to="/login">Go back to login</Link>
                </AppBar>
            </Hidden>
        </React.Fragment>
    );

    // return (
    //     <Grid container justify="center">
    //         <AppBar color="transparent" elevation={0}>
    //             <Toolbar>
    //                 <Grid container alignContent="center" justify="center">
    //                     <Grid item>
    //                         <img alt="Logo" src="https://via.placeholder.com/200x45?text=HDVA+Logo" />
    //                     </Grid>
    //                 </Grid>
    //             </Toolbar>
    //         </AppBar>
    //         <Grid md={4} xs={10} item>
    //             <Grid container alignContent="flex-start">

    //                 <Link to={"/login"}></Link>
    //             </Grid>
    //         </Grid>
    //     </Grid>
    // );
};