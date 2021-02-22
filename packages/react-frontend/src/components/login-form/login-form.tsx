import { Grid, Hidden, IconButton, Input, InputAdornment, Paper } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { setUser, User } from "services/auth.service";
import { useGenericStyle } from "utils/generic.style";
import { messages } from "../../config/en";
import { postAPI } from "../../hooks/useAPI";
import { CTAButton } from "../buttons/cta";
import { ErrorPopup } from "../error-popup/error-popup";
import { HeaderTitle } from "../header/header";
import { useLoginStyles } from "./login-form.style";
import { LoginGTM } from "./login-gtm";
import { LoginContext } from "./login.context";


interface LoginState {
    username: string;
    password: string;
    showPassword: boolean;
}

const LoginComponent = (props: any) => {
    const classes = useLoginStyles();
    const genericClasses = useGenericStyle();
    const history = useHistory();
    const loginContext = useContext(LoginContext);
    const [buttonLoading, setButtonLoading] = useState(false);
    const { isLoading, isSuccess, isError, data: details, refetch } = useQuery({
        queryKey: "login",
        retry: false,
        queryFn: () => postAPI<User>("/login", {
            username: values.username,
            password: values.password
        }),
        cacheTime: 0,
        staleTime: 0,
        enabled: false
    })
    const [values, setValues] = React.useState<LoginState>({
        username: '',
        password: '',
        showPassword: false
    });

    // const trackingLogin = (obj: any) => {
    //     TagManager.dataLayer({
    //         dataLayer: {
    //             brand: gtmOverview.brand,
    //             ...obj
    //         },
    //         dataLayerName: "Login",
    //     })
    // }
    
    const analytics = LoginGTM();
    useEffect(() => {
        if (isSuccess && Array.isArray(details)) {
            setButtonLoading(false);
            const [loggedIn] = details;
            if (!loginContext.setUserDetails) {                
                console.error("loginContext.setUserDetails is null");
            } else {
                loginContext.setUserDetails(loggedIn);
                setUser(loggedIn);
                history.push("/");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    const handleChange = (fieldname: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        analytics.onFocus({
            eventAction: "Changed",
            eventLabel: `${fieldname}`
        });
        setValues({ ...values, [fieldname]: event.target.value });
    };

    const handleClickShowPassword = () => {
        analytics.onFocus({
            eventAction: "Toggled Password",
            eventLabel: `password`
        });
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        analytics.onFocus({
            eventAction: "Mousedown Password",
            eventLabel: `password`
        });
        event.preventDefault();
    };

    const notAllFieldsFilled = [values.username, values.password].filter(elem => !!elem).length < 2;

    return (
        <React.Fragment>
            <ErrorPopup
                message={{
                    text: messages["login.forgotten-password"],
                    link: "/forgotten-password"
                }}
                show={isError}
            />
            <form
                onSubmit={event => {
                    event.preventDefault();
                    analytics.onFocus({
                        eventAction: "Submit"
                    });
                    setValues(values);
                    setButtonLoading(true);
                    // UX Change - delayed on purpose
                    setTimeout(() => {
                        refetch();
                    }, 3000);
                }}
                autoComplete="off"
            >
                <Input
                    autoComplete="username"
                    disabled={buttonLoading || isLoading}
                    color="secondary"
                    className={genericClasses.userFields}
                    fullWidth={true}
                    placeholder={messages["login.form.username"]}
                    id="username"
                    type="text"
                    value={values.username}
                    onFocus={() => analytics.onFocus({
                        eventAction: "Focused",
                        eventLabel: "username"
                    })}
                    onChange={handleChange('username')}
                />
                <Input
                    autoComplete="current-password"
                    disabled={buttonLoading || isLoading}
                    color="secondary"
                    className={genericClasses.userFields}
                    fullWidth={true}
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onFocus={() => analytics.onFocus({
                        eventAction: "Focused",
                        eventLabel: "password"
                    })}
                    onChange={handleChange('password')}
                    placeholder={messages["login.form.password"]}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {values.showPassword ? <Visibility color="secondary" /> : <VisibilityOff color="secondary" />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Grid container justify="flex-end">
                    <Hidden mdDown>
                        <Grid md={5} item className={classes.mdUpMargin}>
                            <CTAButton
                                disabled={notAllFieldsFilled}
                                loading={buttonLoading || isLoading} type="submit" fullWidth size="small" variant="contained" color="primary">
                                {(notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </CTAButton>
                        </Grid>
                        <Grid md={12} item className={classes.mdUpMargin} >
                            <p><Link to="/forgotten-password">{messages["login.form.forgotten-password"]}</Link></p>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item xs={12} className={classes.mdUpMargin}>
                            <CTAButton
                                disabled={notAllFieldsFilled}
                                loading={buttonLoading || isLoading} type="submit" fullWidth size="small" variant="contained" color="primary">
                                {(notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </CTAButton>
                        </Grid>
                    </Hidden>
                </Grid>
            </form>
        </React.Fragment>
    );
}

export const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <Paper className={className}>
            <Hidden mdUp>
                <HeaderTitle
                    alignText="left"
                    disableBack
                    disableGutters
                    title={messages["login.title"]}
                    subtitle={messages["login.subtitle"]}
                    variant="h2"
                />
            </Hidden>
            <Grid item>
                <Hidden mdDown>
                    <HeaderTitle
                        alignText="left"
                        disableBack
                        disableGutters
                        title={messages["login.title"]}
                        subtitle={messages["login.subtitle"]}
                        variant="h2"
                    />
                </Hidden>
                {/* <Hidden mdDown>
                    <p>{messages["login.no-account"]} <br /> {messages["login.inactive-account"]}</p>
                    <div className={classes.hrHeader}><span className="hr-label__text">or</span></div>
                </Hidden> */}
                <LoginComponent />
            </Grid>
        </Paper>
    )
}