import { Container, Grid, Hidden, Input, OutlinedInput, Paper, Typography } from "@material-ui/core";
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { useAPI } from "hooks/useAPI";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { messages } from "../../config/en";
import { useForgottenStyles } from "./forgotten-email.page.style";


const ForgottenEmailPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [data, , , callAPI] = useAPI("/forgotten-password", { prevent: true });
    const classes = useForgottenStyles();
    const notAllFieldsFilled = !email;
    const inProgress = data.isLoading;
    const genericClasses = useGenericStyle();

    return (
        <React.Fragment>
            <Hidden smUp>
                <HeaderTitle alignText="left" color="primary" title={messages["goto.login.page"]} variant="h6" />
                <Container className={classes.foregroundBg} maxWidth="xl">
                    <Grid className={classes.forgottenDetails} container>
                        <Typography className={classes.title} variant="h4">
                            {messages["forgotten-password.title"]}
                        </Typography>
                        <Typography variant="subtitle1">
                            {messages["forgotten-password.description"]}
                        </Typography>
                    </Grid>
                </Container>
            </Hidden>
            <Container maxWidth="xl" >
                <form onSubmit={() => {
                    setTimeout(() => {
                        callAPI({
                            email
                        })
                    })
                }}>
                    <Hidden smDown>
                        <Grid className={classes.desktopForm}>
                            <Paper>
                                <Typography className={classes.title} variant="h4">
                                    {messages["forgotten-password.title"]}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {messages["forgotten-password.description"]}
                                </Typography>
                                <Input
                                    color="secondary"
                                    className={genericClasses.userFields}
                                    fullWidth={true}
                                    value={email}
                                    placeholder={messages["forgotten-password.form.email"]}
                                    id="email"
                                    onChange={event => setEmail(event.target.value)}
                                    type="text"
                                />
                                {/* TODO: Add mdUp to genericClasses */}
                                <CTAButton
                                    className={genericClasses.userFields}
                                    disabled={notAllFieldsFilled}
                                    loading={inProgress}
                                    type="submit"
                                    fullWidth
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                >
                                    {(notAllFieldsFilled ? "Fill in all fields" : "Send reset email")}
                                </CTAButton>
                            </Paper>
                            <Hidden smDown>
                                <div className={genericClasses.userFields}>
                                    <Link className={genericClasses.linkColor} to="/login">{messages["goto.login.page"]}</Link>
                                </div>
                            </Hidden>
                        </Grid>
                    </Hidden>
                    <Hidden smUp>
                        <Grid container className={classes.formMaxWidth}>
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
                            <Grid sm={6} item className={classes.mdUpMargin}>
                                <CTAButton
                                    disabled={notAllFieldsFilled}
                                    loading={inProgress}
                                    type="submit"
                                    fullWidth
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                >
                                    {(notAllFieldsFilled ? "Fill in all fields" : "Send reset email")}
                                </CTAButton>
                            </Grid>
                        </Grid>
                    </Hidden>
                </form>
            </Container>
        </React.Fragment>
    );
};

export default ForgottenEmailPage;