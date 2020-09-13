import React from "react";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";


export const BackButton = () => {
    const history = useHistory();

    return (
        <IconButton edge="start" color="inherit" aria-label="menu" component="span" onClick={() => history.goBack()}>
            <ArrowBackIos />
        </IconButton>
    );
};