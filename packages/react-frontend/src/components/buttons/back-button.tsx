import { IconButton } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";


export const BackButton: React.SFC<{ color?: 'primary' | 'secondary'; }> = ({ color }) => {
    const history = useHistory();

    return (
        <IconButton edge="start" color={color || "inherit"} aria-label="menu" component="span" onClick={() => history.goBack()}>
            <ArrowBackIos />
        </IconButton>
    );
};