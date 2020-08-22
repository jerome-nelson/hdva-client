import React from "react";
import { HeaderTitle } from "components/header/header";
import { TextField, IconButton, Fab } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

export const SignUpPage = () => (
    <React.Fragment>
        <HeaderTitle title="Email Please" />
        <p>This is used to send you updates when a property is added and to reset your password if needed</p>
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