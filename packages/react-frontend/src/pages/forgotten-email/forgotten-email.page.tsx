import React, { useState } from "react";
import { HeaderTitle } from "../../components/header/header";
import { TextField, Fab, IconButton, Grid, createStyles, makeStyles, Theme, OutlinedInput, Button, CircularProgress, AppBar, Typography, Toolbar } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

import { messages } from "../../languages/en";
import { useAPI } from "hooks/useAPI";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    emailForm: {
        width: "100%"
    },
    userField: {
        borderRadius: `${theme.spacing(3)}px`,
        marginTop: `${theme.spacing(3)}px`,
    },
    submitBtn: {
        padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
        marginTop: `${theme.spacing(3)}px`,
        borderRadius: `${theme.spacing(3)}px`
    },
    mdUpMargin: {
        marginLeft: `auto`,
        marginTop: `${theme.spacing(2)}px`
    },
    title: {
        marginTop: `${theme.spacing(10)}px`,
        padding: `${theme.spacing(1)}px 0`,
    },
    description: {
        margin: 0
    }
}));

export const ForgottenEmailPage = () => {
    const [email, setEmail] = useState("");
    const [data, , , callAPI] = useAPI("http://localhost:3001/forgotten-password");
    const classes = useStyles();
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
            {/* <HeaderTitle title="Forgot Your Password?" />
            <img src="https://via.placeholder.com/150" alt="Forgotten Password Icon" title="Forgot Password Icon" />
            <p>Enter your email to recieve a reset link</p>

            <form>
                <TextField fullWidth id="standard-basic" label="Enter email" />
                <div>
                <IconButton aria-label="Submit Form" >
                    <Fab color="primary">
                        <ArrowForward />
                    </Fab>
                </IconButton>
                </div>
            </form> */}
        </Grid>
    );
};