import { Box, Breadcrumbs, Hidden, Link } from "@material-ui/core";
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import React from "react";
import { usePropertyOverviewStyles } from "./properties.overview.style";

const PropertiesOverviewPage: React.FC = () => {
    const classes = usePropertyOverviewStyles();

    // TODO: Typing and splitting of component into modules
    // TODO: Pagination
    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle isFixed title="All Properties" alignText="center" color="primary" variant="h5" />
            </Hidden>
            <Hidden mdDown>
                <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
                    <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
                        <FolderSVG className={classes.icon} /> HDVA
                    </Link>
                    <Link color="secondary" onClick={() => { }} className={classes.link}>
                        All Properties
                    </Link>
                </Breadcrumbs>
            </Hidden>
            <Box className={classes.container}>
                <PropertyTable showSearch show={LIMITS.property} showPagination />
            </Box>
        </React.Fragment>
    )
}

export default PropertiesOverviewPage;