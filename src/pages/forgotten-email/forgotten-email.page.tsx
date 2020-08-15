import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { TextField, Fab, IconButton } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

export const ForgottenEmailPage = () => {
    return (
        <React.Fragment>
            <HeaderTitle title="Forgot Your Password?" />
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
            </form>
        </React.Fragment>
    );
};