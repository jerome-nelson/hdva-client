import { CircularProgress, Hidden } from "@material-ui/core";
import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { CustomTable } from "../../components/table/custom-table";
import { useAPI } from "../../hooks/useAPI";
import { getCurrentUser } from "../../services/auth.service";


export const PropertiesOverviewPage = () => {
    const user = getCurrentUser();
    const propertiesSuffix = !!user.group && user.group !== 1 ? `/${user.group}` : ``;
    const [properties,] = useAPI<Record<string, any>>(`/properties${propertiesSuffix}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });

    const headCells: any[] = [
        { id: 'icon', label: 'Name' },
        { id: 'name', numeric: false, disablePadding: false, label: "" },
        { id: 'modified', numeric: true, disablePadding: false, label: 'Modified' },
        { id: 'viewable', numeric: true, disablePadding: false, label: 'Viewable By' },
        { id: 'options', numeric: true, disablePadding: false, label: "" },
    ];

    // TODO: Typing and splitting of component into modules
    // TODO: Pagination
    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle disableBack title="All Properties" />
            </Hidden>
            <Hidden mdDown>
                <HeaderTitle disableBack alignText="left" title="Properties" disableGutters />
            </Hidden>
            {properties.isLoading ? <CircularProgress size="1.5rem" color="secondary" /> : <CustomTable user={user} headers={headCells} data={properties.data}>
                {/* <Button className={classes.actionBtn} disabled={selectedRows.length <= 0} size="large" variant="outlined" color="primary">
                Download Selected
            </Button> */}
            </CustomTable>}
        </React.Fragment>
    )
}
// TODO: Add pagination