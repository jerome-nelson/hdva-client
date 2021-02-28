import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { withProfiler } from '@sentry/react';
import { gtmOverview } from 'config/analytics';
import { RoleTypes } from 'hooks/useRoles';
import React, { useEffect, useState } from 'react';
import TagManager from "react-gtm-module";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { getCurrentUser, User } from 'services/auth.service';
import { LoginContext } from "./components/login-form/login.context";
import { Modal } from "./components/modal/modal";
import { ModalContext } from './components/modal/modal.context';
import { ROUTES } from "./routing";
import { theme } from "./theme";
import { PrivateRoute } from "./utils/protected-route";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            staleTime: 1000 * 60 * 60 * 24,
            cacheTime: 1000 * 60 * 60 * 24
        }
    }
});

// TODO: Minify
export const AppComponent = () => (
    <Router>
        <Switch>
            {ROUTES.map(({ auth, fullWidth, exact, props, component }, key) => (
                <PrivateRoute auth={auth} fullWidth={fullWidth} exact={exact} key={`${key}-route`} allowed={props.allowed as RoleTypes[]} path={props.path} toRender={component} />
            ))}
        </Switch>
    </Router>
);

const _App = () => {

    const [message, setMsg] = useState("");
    const [showModal, setModal] = useState(false);
    const [userDetails, setUserDetails] = useState<User | null>(getCurrentUser());
    const [dismissable, shouldDismiss] = useState(false);

    useEffect(() => {
        TagManager.initialize({
            gtmId: gtmOverview.id,
            dataLayer: {
                brand: gtmOverview.brand,
                user_id: userDetails?._id
            }
        });
    }, 
    [dismissable, showModal, setMsg, userDetails]
    );

    useEffect(() => {
        TagManager.initialize({
            gtmId: gtmOverview.id,
            dataLayer: {
                brand: gtmOverview.brand,
                user_id: userDetails?._id
            }
        });
    }, [userDetails]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <LoginContext.Provider
                    value={{
                        user: userDetails,
                        setUserDetails
                    }}
                >
                    <ModalContext.Provider
                        value={{
                            dismissable: false,
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
                </LoginContext.Provider>
            </ThemeProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export const App = withProfiler(_App);