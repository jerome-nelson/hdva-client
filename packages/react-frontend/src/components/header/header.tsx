import React from "react";
import { BackButton } from "../back-button/back-button";
import { makeStyles, createStyles, Theme, Typography, Grid } from "@material-ui/core";

interface HeaderProps {
    disableBack?: boolean;
    title: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            
        },
        title: {
            flexGrow: 1,
            "& h1": {
                padding: `${theme.spacing(1)}px 0`,
                fontSize: '24px',
                textAlign: "center"
            }
        }
    }),
);

export const HeaderTitle = ({ disableBack, title }: HeaderProps) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Grid
                alignContent="stretch"
                justify="center"
                container
            >
                {
                    !disableBack &&
                    <Grid alignItems="flex-start" item>
                        <BackButton />
                    </Grid>
                }
                <Grid className={classes.title} item>
                    <Typography variant="h1">
                        {title}
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}