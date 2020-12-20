import { Grid, Hidden, IconButton, Input, InputAdornment } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { User } from "services/auth.service";
import { useGenericStyle } from "utils/generic.style";
import { useAPI } from "../../hooks/useAPI";
import { messages } from "../../languages/en";
import { setUser } from "../../services/auth.service";
import { CTAButton } from "../buttons/cta";
import { ErrorPopup } from "../error-popup/error-popup";
import { useLoginStyles } from "./login-form.style";


interface LoginState {
    username: string;
    password: string;
    isLoading: boolean;
    showPassword: boolean;
}

export const LoginForm = (props: any) => {
    const classes = useLoginStyles();
    const genericClasses = useGenericStyle();
    const history = useHistory();

    const [user, , , callAPI] = useAPI<User>("/login", { prevent: true });
    const [isLoading, setIsLoading] = React.useState(false);
    const [values, setValues] = React.useState<LoginState>({
        username: '',
        password: '',
        showPassword: false,
        isLoading: false
    });

    useEffect(() => {
        const details = user.data;
        if (details.length > 0) {
            const [loggedIn] = details;
            setUser(loggedIn);
            history.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleChange = (prop: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
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
                    text: messages["login.forgotten-password"],
                    link: "/forgotten-password"
                }}
                show={user.isError}
            />
            <form
                onSubmit={event => {
                    event.preventDefault();
                    setValues(values);
                    setIsLoading(true);

                    // UX Change - delayed on purpose
                    setTimeout(() => {
                        callAPI({
                            username: values.username,
                            password: values.password
                        })
                        setIsLoading(false);
                    }, 3000);
                }}
                autoComplete="off"
            >
                <Input
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
                    <Hidden mdDown>
                        <Grid md={5} item className={classes.mdUpMargin}>
                            <CTAButton
                                disabled={notAllFieldsFilled}
                                loading={user.isLoading || isLoading} type="submit" fullWidth size="large" variant="outlined" color="primary">
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
                                loading={user.isLoading || isLoading} type="submit" fullWidth size="small" variant="contained" color="primary">
                                {(notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </CTAButton>
                        </Grid>
                    </Hidden>
                </Grid>
            </form>
        </React.Fragment>
    );
}