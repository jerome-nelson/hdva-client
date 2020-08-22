import React from "react";

import { Button, IconButton, InputAdornment, OutlinedInput, makeStyles, Theme, createStyles, FormHelperText, CircularProgress } from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { login } from "../../services/auth.service";
import { useHistory } from "react-router-dom";

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
        }
    }),
);

export const LoginForm = (props: any) => {
    const classes = useStyles();
    const history = useHistory();

    const [values, setValues] = React.useState<LoginState>({
        username: '',
        password: '',
        showPassword: false,
        isLoading: false
    });
    const [errors, setErrors] = React.useState({
        username: false,
        password: false,
        unknown: false
    });

    const handleChange = (prop: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: any) => {
        let newErrors = {
            username: false,
            password: false,
            unknown: false
        };
        if (!values.username) {
            newErrors = {
                ...newErrors,
                username: true
            }
        }

        if (!values.password) {
            newErrors = {
                ...newErrors,
                password: true
            }
        }

        // try {
            await login(values.username, values.password);
            history.push("/");
        // } catch (e) {
        //     newErrors = {
        //         ...newErrors,
        //         unknown: true
        //     }
        // }
        setErrors(newErrors);
        setValues({
            ...values,
            isLoading: false
        });
    }

    return (
        <React.Fragment>
            {errors.unknown && <div className="alert alert-danger" role="alert">There has been an unknown technical error</div>}
            <form onSubmit={(ev) => {
                ev.preventDefault();
                setValues({
                    ...values,
                    isLoading: true
                })
                setTimeout(() => handleSubmit(ev), 1000)
            }} autoComplete="off">
                <OutlinedInput
                    className={classes.userFields}
                    error={errors.username}
                    fullWidth={true}
                    placeholder="Username"
                    id="username"
                    type="text"
                    value={values.username}
                    onChange={handleChange('username')} />
                {errors.username && <FormHelperText id="component-error-text">Please enter your username</FormHelperText>}
                <OutlinedInput
                    error={errors.password}
                    className={classes.userFields}
                    fullWidth={true}
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    placeholder="Password"
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
                    } />
                {errors.password && <FormHelperText id="component-error-text">Please enter your password</FormHelperText>}
                <Button type="submit" className={classes.submitBtn} fullWidth size="large" variant="outlined" color="primary">
                    {values.isLoading ? <CircularProgress size="1.5rem" color="secondary" /> : "Login"}
                </Button>
                <sub>Account not activated? Please call us on +44208 444 5555</sub>
            </form>
        </React.Fragment>
    );
}