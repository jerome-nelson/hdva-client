import { Hidden } from "@material-ui/core";
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
                    title={<div className={classes.logo}><LogoSVG /></div>} 
                    alignText="left" 
                    color="primary" 
                />
            </Hidden>
            <PropertyTable selectable show={LIMITS.home} />
        </React.Fragment>
    )
}