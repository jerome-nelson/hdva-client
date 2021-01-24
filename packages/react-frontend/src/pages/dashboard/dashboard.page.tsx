import { Grid, Hidden, Typography } from "@material-ui/core";
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React from "react";
import { useDashboardStyles } from "./dashboard.page.style";

export const DashboardPage = () => {
    const classes = useDashboardStyles();
    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle
                    disableBack
                    isFixed
                    title={<div className={classes.logo}><LogoSVG /></div>}
                    alignText="left"
                    color="primary"
                />
            </Hidden>
            <Grid className={classes.container}>
                <HeaderTitle
                    disableBack
                    title="Overview"
                    alignText="left"
                    color="secondary"
                    variant="h5"
                />
                <Grid className={classes.infoText}>
                <Typography color="primary" variant="body1">
                    The most recently uploaded properties are shown here
                </Typography>
                </Grid>
                <PropertyTable selectable show={LIMITS.home} />
            </Grid>
        </React.Fragment>
    )
}