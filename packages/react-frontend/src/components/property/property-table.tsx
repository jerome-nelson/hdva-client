import { BottomNavigation, BottomNavigationAction, Button, Hidden, Typography } from "@material-ui/core";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Skeleton from '@material-ui/lab/Skeleton';
import { LoginContext } from "components/login-form/login.context";
import { CustomPagination } from "components/pagination/pagination";
import { GenericTable } from "components/table/generic-table";
import { MobileTable } from "components/table/mobile-table";
import { getAPI, postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useQuery } from "react-query";
import { Link, useHistory } from 'react-router-dom';
import { STYLE_OVERRIDES } from 'theme';
import { convertToSlug } from "utils/auth";
import { PropertyGTM } from "./property-gtm";
import { useTableStyles } from "./property-table.style";

export interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: string;
    groupId: string;
}

interface PropertyTableProps {
    show?: number;
    showPagination?: boolean;
    selectable?: boolean;
    onSelect?(items: number[]): void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ selectable, show, showPagination, onSelect }) => {
    const [data, setData] = useState<any>([]);
    const history = useHistory();
    const [pageNumber, setPageNumber] = useState(1);
    const { user } = useContext(LoginContext);
    const analytics = PropertyGTM();
    const { data: groups } = useQuery({
        queryKey: [`groups`, user!.group],
        queryFn: () => getAPI<Groups>('/groups', { token: user!.token }),
        enabled: Boolean(user)
    });
    const { data: total } = useQuery({
        queryKey: [`properties`, user!.group, 'total'],
        queryFn: () => postAPI<number>('/properties-count', {
            group: user!.group > 1 ? user!.group : null,
        },
            {
                token: user!.token
            }),
        enabled: Boolean(user && groups)
    });
    const { data: propertyData, isLoading, isSuccess } = useQuery({
        queryKey: [`properties`, user!.group, show || 0, pageNumber],
        queryFn: () => postAPI<Properties>('/properties', {
            group: user!.group > 1 ? user!.group : null,
            limit: show || null,
            offset: show && pageNumber > 1 ? show * (pageNumber - 1) : null
        }, {
            token: user!.token
        }),
        keepPreviousData: true,
        enabled: Boolean(total && user && groups)
    });

    useEffect(() => {

        if (!propertyData || !groups) {
            return;
        }

        const newData = propertyData.map((property: Properties) => {
            const groupName = groups.reduce((accu: string, curr: Groups) => {
                return curr.groupId === property.groupId ? curr.name : accu;
            }, "Group Not Found");
            return createData(
                property.propertyId,
                property.name,
                groupName,
                {
                    vt: true,
                    floorplan: true,
                    images: true
                },
                new Date(property.modifiedOn).toDateString()
            )
        });
        setData(newData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups, propertyData])

    const classes = useTableStyles();
    function createData(id: string, name: string, group: string, propertyDetails: Record<string, boolean>, updated: string) {
        return {
            image: {
                data: (
                    <LazyLoad height={STYLE_OVERRIDES.thumbnail}>
                        <Link
                            onClick={() => {
                                analytics.onAction({
                                    eventAction: "Navigate to Property - Image",
                                    eventLabel: name,
                                })
                            }}
                            to={{
                                pathname: `/properties/${convertToSlug(name)}`,
                                state: {
                                    propertyName: name,
                                    propertyId: id
                                }
                            }}>
                            <FolderSVG />
                        </Link>
                    </LazyLoad>
                )
            },
            name: {
                data: <Link
                    onClick={() => {
                        analytics.onAction({
                            eventAction: "Navigate to Property - Link",
                            eventLabel: name
                        })
                    }}
                    to={{
                        pathname: `/properties/${convertToSlug(name)}`,
                        state: {
                            propertyName: name,
                            propertyId: id
                        }
                    }}>
                    <Typography noWrap>
                        {name}
                    </Typography>
                </Link>,
            },
            group: {
                hideOnMobile: true,
                data: <Typography noWrap>{group}</Typography>,
            },
            updated: {
                data: <Typography noWrap>{updated}</Typography>
            },
            extras: {
                mobile: true,
                data: (
                    <React.Fragment>
                        <Hidden smUp>
                            <BottomNavigation
                                showLabels
                            // className={classes.root}
                            >
                                <BottomNavigationAction
                                    onClick={() => {
                                        history.push(
                                            `/properties/${convertToSlug(name)}`,
                                            {
                                                propertyName: name,
                                                propertyId: id
                                            }
                                        )
                                    }}
                                    icon={<BurstModeIcon />}
                                    label="View Images" />
                                <BottomNavigationAction
                                    // classes={
                                    //     checked ? {
                                    //         root: classes.navigationSelected
                                    //     } : {}
                                    // }
                                    label="Select Folder"
                                    // onClick={() => setChecked(!checked)}
                                    // checked ? <CreateNewFolderIcon /> : 
                                    icon={<CreateNewFolderOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    onClick={async () => {
                                        // generate-download
                                        analytics.onAction({
                                            eventAction: "Download Property",
                                            eventLabel: name
                                        });
    
                                        await postAPI<any>('/generate-download', {
                                            pid: [id],
                                        }, {
                                            token: user!.token
                                        })
                                    }}
                                    label="Download Folder"
                                    icon={
                                        // processing.downloading ?
                                        //     <CircularProgress variant="indeterminate" size="1.2rem" /> :
                                        <CloudDownloadIcon />
                                    }
                                />
                                {/* Only available to admin users */}
                                <BottomNavigationAction
                                    label="Delete Folder"
                                    // onClick={() => {
                                    //     setStatus({
                                    //         ...processing,
                                    //         deleting: response.isLoading
                                    //     });
                                    //     callAPI({
                                    //         pids: [pid]
                                    //     });
                                    // }}
                                    icon={
                                        // processing.deleting ?
                                        //     <CircularProgress variant="indeterminate" size="1.2rem" /> :
                                        <DeleteForeverIcon />
                                    }
                                />
                            </BottomNavigation>
                        </Hidden>
                        <Hidden smDown>
                            <Button
                                onClick={async () => {
                                    // generate-download
                                    analytics.onAction({
                                        eventAction: "Download Property",
                                        eventLabel: name
                                    });

                                    await postAPI<any>('/generate-download', {
                                        pid: [id],
                                    }, {
                                        token: user!.token
                                    })
                                }}
                                size="large"
                                variant="outlined"
                                color="primary"
                            >
                                Download
                    </Button>
                        </Hidden>
                    </React.Fragment>
                )
            }
        };
    }

    const head = [
        { name: "Name", className: classes.tableHeadCell, colSpan: 2 },
        { name: "Group", className: classes.tableHeadCell, colSpan: 2 },
        { name: "Modified", className: classes.tableHeadCell, colSpan: 2 }
    ];


    const cells = [
        { className: `${classes.hideOnMobile} ${classes.imageCell}` },
        {},
        { className: classes.media },
        {},
        { className: classes.moreCell }
    ];

    const sample = {
        image: {
            data: <Skeleton variant="rect" animation="wave" height={65} width={65} />
        },
        name: {
            data: <Skeleton variant="rect" animation="wave" height={20} width={300} />
        },
        group: {
            data: <Skeleton variant="rect" animation="wave" height={20} width={300} />
        },
        dateUpdate: {
            data: <Skeleton variant="rect" animation="wave" height={20} width={300} />
        },
        extra: {
            data: <Skeleton variant="rect" animation="wave" height={40} width={130} />
        },
    };
    const skeleton = [
        sample,
        sample,
        sample,
        sample
    ];

    return (
        <React.Fragment>
            <Hidden smDown>
                <GenericTable
                    onSelect={onSelect}
                    // onSelected={() => {
                    //     <Grid container xs={10} spacing={1}>
                    //         <Grid item>
                    //             <CTAButton
                    //                 loading={false}
                    //                 onClick={() => alert(`Should download properties from pids:  ${hasSelected && hasSelected.join(",")}`)}
                    //                 fullWidth
                    //                 className={genericClasses.actionButton}
                    //                 disabled={!hasSelected || hasSelected && hasSelected.length <= 0}
                    //                 size="medium"
                    //                 variant="contained"
                    //                 color="primary"
                    //                 type="submit"
                    //             >
                    //                 Download Selected
                    //                     </CTAButton>
                    //         </Grid>
                    // }}
                    selectable={selectable}
                    head={head}
                    cells={cells}
                    data={(isLoading || !isSuccess || data.length <= 0) ? skeleton : data}
                />
                {!(isLoading || !isSuccess || data.length <= 0) && showPagination && show && !isNaN(total as unknown as number) && (
                    <div className={classes.pagination}>
                        <CustomPagination
                            count={Math.floor((total as unknown as number) / show)}
                            onChange={pagenumber => { setPageNumber(pagenumber) }}
                        />
                    </div>
                )}
            </Hidden>
            <Hidden mdUp>
                <MobileTable
                    cellStyles={[cells[0]]}
                    selectable={selectable}
                    data={data}
                />
            </Hidden>
        </React.Fragment>
    );
}