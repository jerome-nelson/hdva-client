import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

import { Button, IconButton, InputAdornment, OutlinedInput, makeStyles, Theme, createStyles, CircularProgress, Box, Grid, Hidden } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { setUser } from "../../services/auth.service";
import { useAPI } from "../../hooks/useAPI";
import { messages } from "../../languages/en";

interface LoginState {
    username: string;
    password: string;
    isLoading: boolean;
    showPassword: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        userFields: {
            borderRadius: `${theme.spacing(3)}px`,
            marginTop: `${theme.spacing(3)}px`,
        },
        submitBtn: {
            padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
            marginTop: `${theme.spacing(3)}px`,
            borderRadius: `${theme.spacing(3)}px`
        },
        mdUpMargin: {
            marginTop: `${theme.spacing(2)}px`
        }
    }),
);

export const LoginForm = (props: any) => {
    const classes = useStyles();
    const history = useHistory();

    const [user, setData, setUrl, callAPI] = useAPI("http://localhost:3001/login", true, {});
    const [isLoading, setIsLoading] = React.useState(false);
    const [values, setValues] = React.useState<LoginState>({
        username: '',
        password: '',
        showPassword: false,
        isLoading: false
    });

    useEffect(() => {
        // TODO: Fix data typing of API hook
        if (!!(user.data as any).user) {
            setUser(user.data);
            history.push("/");
        }
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
            {user.isError && (
                <Link to="/forgotten-password">
                    <Box bgcolor="secondary.main" color="secondary.contrastText" p={2} role="alert">
                        {messages["login.forgotten-password"]}
                    </Box>
                </Link>)
            }
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
                <OutlinedInput
                    className={classes.userFields}
                    fullWidth={true}
                    placeholder={messages["login.form.username"]}
                    id="username"
                    type="text"
                    value={values.username}
                    onChange={handleChange('username')}
                />
                <OutlinedInput
                    className={classes.userFields}
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
                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <Grid container justify="flex-end">
                    <Hidden mdDown>
                        <Grid md={5} item className={classes.mdUpMargin}>
                            <Button disabled={notAllFieldsFilled} type="submit" className={classes.submitBtn} fullWidth size="large" variant="outlined" color="primary">
                                {(user.isLoading || isLoading) ? <CircularProgress size="1.5rem" color="secondary" /> : (notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </Button>
                        </Grid>
                        <Grid md={12} item className={classes.mdUpMargin} >
                            <p><Link to="/forgotten-password">{messages["login.form.forgotten-password"]}</Link></p>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item xs={12}>
                            <Button disabled={notAllFieldsFilled} type="submit" className={classes.submitBtn} fullWidth size="large" variant="outlined" color="primary">
                                {(user.isLoading || isLoading) ? <CircularProgress size="1.5rem" color="secondary" /> : (notAllFieldsFilled ? "Fill in all fields" : "Login")}
                            </Button>
                        </Grid>
                    </Hidden>
                </Grid>
            </form>
        </React.Fragment>
    );
}