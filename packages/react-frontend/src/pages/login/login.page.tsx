import { AppBar, Grid } from "@material-ui/core";
import { LoginForm } from "components/login-form/login-form";
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React from "react";
import { useContainerStyles, useLoginPageStyles } from "./login.page.style";

interface ContainerProps {
    className?: string; 
}

const Container: React.FC<ContainerProps> = ({ className, children }) => {
    const classes = useContainerStyles();
    return <div className={`${classes.root} ${className}`}>{children}</div>
}

const LoginPage = () => {
    const classes = useLoginPageStyles();
    return (
        <Container className={classes.container}>
            <AppBar color="primary" className={classes.forgottenDetails} elevation={0} position="fixed">
                <Grid container>
                    <Grid className={classes.logo} item xs={12}>
                        <div><LogoSVG /></div>
                    </Grid>
                    <Grid item xs={12}>
                        <LoginForm className={classes.formMaxWidth} />
                    </Grid>
                </Grid>
                {/* <Link className={`${genericClasses.linkColor} ${classes.footerLink}`} to="/forgotten-password">{messages["login.form.forgotten-password"]}</Link> */}
            </AppBar>
        </Container>
    );
}

export default LoginPage;