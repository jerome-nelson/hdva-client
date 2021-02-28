import { Grid, Hidden } from "@material-ui/core";
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React from "react";
import { useHistory } from "react-router-dom";
import { useDashboardStyles } from "./dashboard.page.style";

const DashboardPage = () => {
    const classes = useDashboardStyles();
    const history = useHistory();
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
                <Grid className={classes.infoText} container>
                    <Grid item>
                        <p>The most recently uploaded properties are shown here</p>
                    </Grid>
                    <Grid item className={classes.moreLink}>
                        <CTAButton
                            onClick={() => history.push("/properties")}
                            variant="outlined"
                            color="primary"
                            loading={false}
                            type="button"
                        >
                            View More Properties
                    </CTAButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid className={classes.table}>
                <PropertyTable selectable show={LIMITS.home} />
            </Grid>
        </React.Fragment>
    )
}

export default DashboardPage;