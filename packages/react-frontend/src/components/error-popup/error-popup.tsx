import React from "react";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useErrorPopupStyles } from "./error-popup.style";

interface IErrorPopup {
    rounded?: boolean;
    message?: {
        text: string;
        link?: string;
    };
    show?: boolean;
}

export const ErrorPopup: React.FC<IErrorPopup> = ({ children, message, rounded, show }) => {

    const classes = useErrorPopupStyles();
    const extraOptions = rounded ? {
        borderRadius: 24
    } : {};

    return (
        <Box {...extraOptions} hidden={!show} bgcolor="secondary.main" color="secondary.contrastText" p={2} role="alert">
            {message && (message.link ?
                <Link className={classes.link} to={message.link}>{message.text}</Link> : message.text)}
            {!message && children}
        </Box>
    );
}