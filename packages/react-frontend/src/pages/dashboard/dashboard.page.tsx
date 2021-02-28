import { Grid, Hidden } from "@material-ui/core";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import AddProperty from "components/property/add-property";
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
            <AddProperty />
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
                    title="Recently uploaded"
                    alignText="left"
                    color="secondary"
                    variant="h5"
                />
            </Grid>
            <Grid className={classes.table}>
                <Grid item className={classes.btnNav}>
                    <CTAButton
                        size="small"
                        variant="contained"
                        color="primary"
                        type="button"
                        startIcon={<CreateNewFolderIcon />}
                    >
                        Add New Property
                </CTAButton>
                </Grid>
                <PropertyTable selectable show={LIMITS.home} />
                <Grid item className={classes.moreLink}>
                    <CTAButton
                        fullWidth
                        size="small"
                        onClick={() => history.push("/properties")}
                        variant="outlined"
                        color="primary"
                        type="button"
                    >
                        View More Properties
                    </CTAButton>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default DashboardPage;