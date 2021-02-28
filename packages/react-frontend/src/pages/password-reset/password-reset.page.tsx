import { Container, Grid, Hidden, Input, OutlinedInput, Paper, Typography } from "@material-ui/core";
import { CTAButton } from "components/buttons/cta";
import { postAPI } from "hooks/useAPI";
import { useQuery as useQuerySelector } from "hooks/useQuery";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { usePasswordStyles } from "./password-reset.page.style";

interface Validation {
    success: boolean;
}

// TODO: Needs db and api to store strings
// Generate and send JWT token, this will be used to reset password in admin -> new JWT is sent and then logged in
const PasswordResetPage: React.FC = () => {
    const query = useQuerySelector();
    const history = useHistory();
    const [password, setPassword] = useState("");
    const { data: resetStatus, isLoading, refetch: resetPassword } = useQuery({ 
        queryFn: () => postAPI<Validation>("/change-password", {
            password
        }),
        enabled: false 
    });
    const { data: validate, isSuccess, refetch: checkStatus } = useQuery({ 
        queryFn: () => postAPI<Validation>("/validate-reset"),
        enabled: false 
    });
    
    const classes = usePasswordStyles();
    const notAllFieldsFilled = !password;
    const genericClasses = useGenericStyle();

    useEffect(() => {
        const token = query.get("token");
        if (!token || validate && !isSuccess) {
            history.push("/");
        }
       
        // Problem with useAPI
        // if (!validate.isError) {
        //     checkStatus({
        //         token 
        //     });
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, validate]);

    return (
        <React.Fragment>
            <Hidden smUp>
                <Container className={classes.foregroundBg} maxWidth="xl">
                    <Grid className={classes.forgottenDetails} container>
                        <Typography className={classes.title} variant="h4">
                            Reset Password
                        </Typography>
                        <Typography variant="subtitle1">
                            Enter your new password - you will be automatically logged in afterwards.
                        </Typography>
                    </Grid>
                </Container>
            </Hidden>
            <Container maxWidth="xl" >
                <form onSubmit={() => {
                    setTimeout(() => {
                        resetPassword()
                    })
                }}>
                    <Hidden smDown>
                        <Grid className={classes.desktopForm}>
                            <Paper>
                                <Typography className={classes.title} variant="h4">
                                    Reset Password
                                </Typography>
                                <Typography variant="subtitle1">
                                    Enter your new password - you will be automatically logged in afterwards.
                                </Typography>
                                <Input
                                    color="secondary"
                                    className={genericClasses.userFields}
                                    fullWidth={true}
                                    value={password}
                                    placeholder="Please enter a new password"
                                    id="password"
                                    onChange={event => setPassword(event.target.value)}
                                    type="text"
                                />
                                {/* TODO: Add mdUp to genericClasses */}
                                <CTAButton
                                    className={genericClasses.userFields}
                                    disabled={notAllFieldsFilled}
                                    loading={isLoading}
                                    type="submit"
                                    fullWidth
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                >
                                    {(notAllFieldsFilled ? "Fill in all fields" : "Reset Password")}
                                </CTAButton>
                            </Paper>
                        </Grid>
                    </Hidden>
                    <Hidden smUp>
                        <Grid container className={classes.formMaxWidth}>
                            <OutlinedInput
                                className={classes.userField}
                                fullWidth={true}
                                value={password}
                                placeholder="Please enter a new password"
                                id="password"
                                onChange={event => setPassword(event.target.value)}
                                type="text"
                            />
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid sm={6} item className={classes.mdUpMargin}>
                                <CTAButton
                                    disabled={notAllFieldsFilled}
                                    loading={isLoading}
                                    type="submit"
                                    fullWidth
                                    size="small"
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

export default PasswordResetPage;