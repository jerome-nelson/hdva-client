import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import { CssBaseline } from '@material-ui/core';
import Container from '@material-ui/core/Container';

import { ModalContext } from './components/modal/modal.context';
import { Modal } from "./components/modal/modal";
import { ROUTES } from "./routing";
import { PrivateRoute } from "./utils/protected-route";

// TODO: Minify
export const AppComponent = () => (
    <Container maxWidth="xl">
        <Router>
            <Switch>
                {ROUTES.map(({ auth, fullWidth, exact, props, component }, key) => (
                    <PrivateRoute auth={auth} fullWidth={fullWidth} exact={exact} key={`${key}-test`} allowed={props.allowed} path={props.path} toRender={component} />
                ))}
            </Switch>
        </Router>
    </Container>
);

export const App = () => {

    const [message, setMsg] = useState("");
    const [showModal, setModal] = useState(false);
    const [dismissable, shouldDismiss] = useState(false);

    return (
        <ModalContext.Provider
            value={{
                dismissable: dismissable,
                message: message,
                flashModal: showModal,
                shouldDismiss: shouldDismiss,
                updateMessage: setMsg,
                setModal: setModal
            }}
        >
            <CssBaseline />
            <Modal />
            <AppComponent />
        </ModalContext.Provider>
    );
}