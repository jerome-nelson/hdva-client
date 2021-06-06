import { Grid, IconButton, Input, InputAdornment, Paper } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { ErrorPopup } from "components/popup/error-popup";
import { messages } from "config/en";
import { postAPI } from "hooks/useAPI";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { setUser, User } from "services/auth.service";
import { useGenericStyle } from "utils/generic.style";
import { useLoginStyles } from "./login-form.style";
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
    
    useEffect(() => {
        if (!isLoading) {
            setButtonLoading(false);
        }
        if (isSuccess && Array.isArray(details)) {
           
            const [loggedIn] = details;
            if (!loginContext.setUserDetails) {                
                console.error("loginContext.setUserDetails is null");
            } else {
                loginContext.setUserDetails(loggedIn);
                setUser(loggedIn);
                history.push("/");
            }
        }
    }, [isLoading, isSuccess]);

    const handleChange = (fieldname: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [fieldname]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const notAllFieldsFilled = [values.username, values.password].filter(elem => !!elem).length < 2;

    return (
        <React.Fragment>
            <ErrorPopup
                message={{
                    text: messages["login.forgotten-password"]
                }}
                show={isError}
            />
            <form
                onSubmit={event => {
                    event.preventDefault();
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
                        <Grid item xs={12} className={classes.mdUpMargin}>
                            <CTAButton
                                disabled={notAllFieldsFilled}
                                loading={buttonLoading || isLoading} type="submit" fullWidth size="medium" variant="contained" color="primary">
                                {(notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </CTAButton>
                        </Grid>
                    {/* </Hidden> */}
                </Grid>
            </form>
        </React.Fragment>
    );
}

export const LoginForm: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <Paper className={className} square>
            {/* <Hidden mdUp> */}
                <HeaderTitle
                    alignText="left"
                    disableBack
                    disableGutters
                    title={messages["login.title"]}
                    subtitle={messages["login.subtitle"]}
                    variant="h2"
                />
            {/* </Hidden> */}
            <Grid item>
                {/* <Hidden mdDown>
                    <HeaderTitle
                        alignText="left"
                        disableBack
                        disableGutters
                        title={messages["login.title"]}
                        subtitle={messages["login.subtitle"]}
                        variant="h2"
                    />
                </Hidden> */}
                {/* <Hidden mdDown>
                    <p>{messages["login.no-account"]} <br /> {messages["login.inactive-account"]}</p>
                    <div className={classes.hrHeader}><span className="hr-label__text">or</span></div>
                </Hidden> */}
                <LoginComponent />
            </Grid>
        </Paper>
    )
}