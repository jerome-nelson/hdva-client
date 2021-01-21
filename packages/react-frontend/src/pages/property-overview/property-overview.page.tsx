import { BottomNavigation, BottomNavigationAction, CircularProgress, Hidden } from "@material-ui/core";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { Placeholder } from "components/placeholder/placeholder";
import { Properties } from "components/property/property-table";
import { messages } from "config/en";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useGenericStyle } from "utils/generic.style";
import { postAPI, useAPI } from "../../hooks/useAPI";
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

export const PropertiesOverviewPage: React.FC = () => {
    const { user } = useContext(LoginContext);
    const genericClasses = useGenericStyle();
    const classes = usePropertyOverviewStyles();
    const { data: properties, isLoading, isSuccess, refetch } = useQuery({
        queryKey: [`properties`, user && user.group],
        queryFn: () => postAPI<Properties>('/properties', {
            limit: 100,
            group: user && user.group > 1 ? user && user.group : null
        }, {
            token: user && user.token 
        }),
        retry: 3,
        enabled: false
    });

    useEffect(() => {
        if (user && user.group) {
            refetch();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

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
                <HeaderTitle title="All Properties" alignText="center" color="primary" variant="h5" />
            </Hidden>
            {properties && properties.length === 0 ? (
                <Placeholder
                    subtitle={messages["placeholder.properties.subtitle"]}
                    title={messages["placeholder.properties.title"]}
                >
                    <HomeWorkIcon />
                </Placeholder>
            ) : (
                // properties.isLoading ?
                <CircularProgress size="1.5rem" color="secondary" /> 
                // :
                // <CustomTable user={user as User} headers={headCells} data={propertyData.map(property => ({
                //     ...property,
                //     collapsedTab: ChildOption
                // }))}>
                //     {/* TODO: Add a dismiss when button is clicked and api is called */}
                //     {(hasSelected: string[] | undefined) => (
                //         <React.Fragment>
                //             <Hidden only={["md", "lg", "xl"]}>
                //                 <CTAButton
                //                     loading={false}
                //                     type="submit"
                //                     onClick={() => alert(`Should download properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
                //                     fullWidth
                //                     className={`${genericClasses.actionButton} ${classes.mobileBtn}`}
                //                     disabled={!hasSelected || hasSelected && hasSelected.length <= 0}
                //                     size="large" variant="contained" color="secondary"
                //                 >
                //                     Download Selected
                //                 </CTAButton>
                //             </Hidden>
                //             <Hidden only={["xs", "sm"]}>
                //                 <Grid container xs={10} spacing={1}>
                //                     <Grid item>
                //                         <CTAButton
                //                             loading={false}
                //                             onClick={() => alert(`Should download properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
                //                             fullWidth
                //                             className={genericClasses.actionButton}
                //                             disabled={!hasSelected || hasSelected && hasSelected.length <= 0}
                //                             size="medium"
                //                             variant="contained"
                //                             color="primary"
                //                             type="submit"
                //                         >
                //                             Download Selected
                //                         </CTAButton>
                //                     </Grid>
                //                     <Grid item>
                //                         <CTAButton
                //                             loading={false}
                //                             onClick={() => alert(`Should de;ete properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
                //                             fullWidth
                //                             className={genericClasses.actionButton}
                //                             disabled={!hasSelected || hasSelected && hasSelected.length <= 0}
                //                             size="medium" variant="contained" color="primary" type="submit"
                //                         >
                //                             Delete Selected
                //                         </CTAButton>
                //                     </Grid>
                //                 </Grid>
                //             </Hidden>
                //         </React.Fragment>
                //     )}
                // </CustomTable>
                // )}
            )}
        </React.Fragment>
    )
}
