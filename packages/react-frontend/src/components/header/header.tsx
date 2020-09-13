import React from "react";
import { BackButton } from "../back-button/back-button";
import { makeStyles, createStyles, Theme, Typography, AppBar, Toolbar } from "@material-ui/core";

interface HeaderProps {
    alignText?: 'center' | 'left' | 'right';
    disableGutters?: boolean;
    disableBack?: boolean;
    title: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxShadow: "none",
        },
        title: (props: HeaderProps ) => ({
            flexGrow: 1,
            padding: `${theme.spacing(1)}px 0`,
            textAlign: props.alignText ? props.alignText : "center"
        })
    }),
);

export const HeaderTitle = ({ alignText, disableGutters, disableBack, title }: HeaderProps) => {
    const classes = useStyles({ title, alignText });
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