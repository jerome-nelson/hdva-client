import { Grid, Hidden } from "@material-ui/core";
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { messages } from 'config/en';
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React from "react";
import { useHistory } from "react-router-dom";
import { HEIGHTS } from "theme";
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
                    fixedHeight={HEIGHTS.logoHeader}
                    title={<div className={classes.logo}><LogoSVG /></div>}
                    alignText="left"
                    color="primary"
                />
            </Hidden>
            <Grid className={classes.container}>
                <HeaderTitle
                    disableBack
                    title="Recently uploaded"
                    alignText="left"
                    color="secondary"
                    variant="h5"
                />
            </Grid>
            <Grid className={classes.table}>
                <PropertyTable show={LIMITS.home} />
                <Grid item className={classes.moreLink}>
                    <CTAButton
                        fullWidth
                        size="medium"
                        onClick={() => history.push("/properties")}
                        variant="outlined"
                        color="primary"
                        type="button"
                    >
                        {messages["view.more.cta"]}
                    </CTAButton>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default DashboardPage;