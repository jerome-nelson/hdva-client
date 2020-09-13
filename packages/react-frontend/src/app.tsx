import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import Container from '@material-ui/core/Container';
import { ROUTES } from "./routing";
import { PrivateRoute } from "utils/protected-route";

export const App = () => {    
    return <Container maxWidth="xl">
        <Router>
            <Switch>
                {
                    ROUTES.map(({ auth, fullWidth, exact, props, component }, key) => {
                        return <PrivateRoute auth={auth} fullWidth={fullWidth} exact={exact} key={`${key}-test`} path={props.path} component={component} />
                    })
                }
            </Switch>
        </Router>
    </Container>
};
