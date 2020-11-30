import { AppBar, Button, CircularProgress, Grid, OutlinedInput, Toolbar, Typography } from "@material-ui/core";
import { useAPI } from "hooks/useAPI";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { messages } from "../../languages/en";
import { useForgottenStyles } from "./forgotten-email.page.style";


export const ForgottenEmailPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [data, , , callAPI] = useAPI("/forgotten-password");
    const classes = useForgottenStyles();
    const notAllFieldsFilled = !email;

    return (
        <Grid container justify="center">
            <AppBar color="transparent" elevation={0}>
                <Toolbar>
                    <Grid container alignContent="center" justify="center">
                        <Grid item>
                            <img alt="Logo" src="https://via.placeholder.com/200x45?text=HDVA+Logo" />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid md={4} xs={10} item>
                <Grid container alignContent="flex-start">
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
                    <Link to={"/login"}>Go back to login</Link>
                </Grid>
            </Grid>
        </Grid>
    );
};