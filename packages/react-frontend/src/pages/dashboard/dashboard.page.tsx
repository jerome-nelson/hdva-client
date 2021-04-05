import { Grid, Hidden } from "@material-ui/core";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { messages } from 'config/en';
import { Roles } from "hooks/useRoles";
import { ReactComponent as LogoSVG } from "media/logo.svg";
import React, { Suspense, useState } from "react";
import { useHistory } from "react-router-dom";
import { Permissions } from "utils/permissions";
import { useDashboardStyles } from "./dashboard.page.style";


const DashboardPage = () => {
    const [showPopup, setPopup] = useState(false);
    const classes = useDashboardStyles();
    const history = useHistory();

    // TODO: Fix Typing
    const AddProperty = React.lazy(() => import("../../components/property/add-property"));

    return (
        <React.Fragment>
            <Permissions showOn={[Roles.super, Roles.admin, Roles.uploader]}>
                <Suspense fallback={false}>
                    {showPopup && <AddProperty onClose={() => setPopup(() => !showPopup)} />}
                </Suspense>
            </Permissions>
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
                        size="medium"
                        variant="contained"
                        color="primary"
                        type="button"
                        startIcon={<CreateNewFolderIcon />}
                        onClick={() => setPopup(() => !showPopup)}
                    >
                        {messages["upload.button.cta"]}
                    </CTAButton>
                </Grid>
                <PropertyTable selectable show={LIMITS.home} />
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