import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { BackButton } from "../back-button/back-button";
import { useHeaderStyles } from "./header.style";


export interface HeaderProps {
    alignText?: 'center' | 'left' | 'right';
    disableGutters?: boolean;
    disableBack?: boolean;
    title: string;
}

export const HeaderTitle: React.SFC<HeaderProps> = ({ alignText, disableGutters, disableBack, title }) => {
    const classes = useHeaderStyles({ title, alignText });
    return (
        <React.Fragment>
            <AppBar color="transparent" className={classes.root} position="static">
                <Toolbar disableGutters={disableGutters}>
                    {!disableBack && (<BackButton />)}
                    <Typography className={classes.title} variant="h6">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}