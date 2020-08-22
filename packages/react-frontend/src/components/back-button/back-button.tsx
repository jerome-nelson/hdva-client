import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";

export const BackButton = () => {
    const history = useHistory();

    return (
        <Button onClick={() => history.goBack()}>
            <ArrowBackIos />
        </Button>
    );
};