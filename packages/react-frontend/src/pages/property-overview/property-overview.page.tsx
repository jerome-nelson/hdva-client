import { BottomNavigation, BottomNavigationAction, Box, Breadcrumbs, CircularProgress, Hidden, Link } from "@material-ui/core";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { HeaderTitle } from "components/header/header";
import { PropertyTable } from "components/property/property-table";
import { LIMITS } from "config/data";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { useAPI } from "../../hooks/useAPI";
import { usePropertyOverviewStyles } from "./properties.overview.style";

// TODO: Virtual Scroll OR table
// TODO: RE-REVIEW TABLE
const ChildOption: React.FC<{ link: string; pid: number; checked: boolean; setChecked: Dispatch<SetStateAction<any>> }> = ({ link, pid, checked, setChecked }) => {
    const [processing, setStatus] = useState({
        downloading: false,
        deleting: false
    });
    const [response, , , callAPI] = useAPI<any>('/properties/delete', {
        prevent: true,
        useToken: true
    });
    const classes = usePropertyOverviewStyles();
    const history = useHistory();

    useEffect(() => {
        if (response.data.length > 0) {
            history.go(0);
        }
    }, [history, response]);

    return (
        <BottomNavigation
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction
                onClick={() => history.push(
                    link,
                    {
                        propertyId: pid
                    })}
                icon={<BurstModeIcon />}
                label="View Images" />
            <BottomNavigationAction
                classes={
                    checked ? {
                        root: classes.navigationSelected
                    } : {}
                }
                label="Select Folder"
                onClick={() => setChecked(!checked)}
                icon={checked ? <CreateNewFolderIcon /> : <CreateNewFolderOutlinedIcon />}
            />
            <BottomNavigationAction
                onClick={() => {
                    // TODO: Download API
                    setStatus({
                        ...processing,
                        downloading: true
                    });
                }}
                label="Download Folder"
                icon={
                    processing.downloading ?
                        <CircularProgress variant="indeterminate" size="1.2rem" /> :
                        <CloudDownloadIcon />
                }
            />
            {/* Only available to admin users */}
            <BottomNavigationAction
                label="Delete Folder"
                onClick={() => {
                    setStatus({
                        ...processing,
                        deleting: response.isLoading
                    });
                    callAPI({
                        pids: [pid]
                    });
                }}
                icon={
                    processing.deleting ?
                        <CircularProgress variant="indeterminate" size="1.2rem" /> :
                        <DeleteForeverIcon />
                }
            />
        </BottomNavigation>
    );
}

const PropertiesOverviewPage: React.FC = () => {
    const genericClasses = useGenericStyle();
    const classes = usePropertyOverviewStyles();

    const headCells: Record<string, unknown>[] = [
        { id: 'icon', label: 'Name' },
        { id: 'name', numeric: false, disablePadding: false, label: "" },
        { id: 'modified', numeric: true, disablePadding: false, label: 'Modified', hideOn: ['xs', 'sm'] },
        { id: 'viewable', numeric: true, disablePadding: false, label: 'Viewable By', hideOn: ['xs', 'sm'] },
        { id: 'options', numeric: true, disablePadding: false, label: "", hideOn: ['xs', 'sm'] },
        { id: 'collapsed', numeric: true, disablePadding: false, label: "", hideOn: ['md', 'lg', 'xl'] },
    ];

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
                {
                    <PropertyTable selectable show={LIMITS.property} showPagination />
                }
            </Box>
        </React.Fragment>
    )
}

export default PropertiesOverviewPage;