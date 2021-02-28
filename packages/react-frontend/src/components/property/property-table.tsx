import { BottomNavigation, BottomNavigationAction, Button, CircularProgress, Grid, Hidden, LinearProgress, Typography } from "@material-ui/core";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Skeleton from '@material-ui/lab/Skeleton';
import { LoginContext } from "components/login-form/login.context";
import { CustomPagination } from "components/pagination/pagination";
import { GenericTable } from "components/table/generic-table";
import { MobileTable } from "components/table/mobile-table";
import { getAPI, getDownload, postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import { useQueries, useQuery } from "react-query";
import { Link, useHistory } from 'react-router-dom';
import { STYLE_OVERRIDES } from 'theme';
import { convertToSlug } from "utils/auth";
import { PropertyGTM } from "./property-gtm";
import { useMiniTableStyles, useTableStyles } from "./property-table.style";

export interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: string;
    groupId: string;
}

export interface PropertyTableProps {
    mini?: boolean;
    show?: number;
    showPagination?: boolean;
    selectable?: boolean;
    onSelect?(items: number[]): void;
}

export interface PropertyMiniTableProps {
    className?: string;
    color?: "primary" | "secondary";
    filter?: string;
    onResult?(data: number): void;
}

export const PropertyMiniTable: React.FC<PropertyMiniTableProps> = ({ className, color, filter, onResult }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [propertyData, setPropertyData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState(filter || "");
    const { user } = useContext(LoginContext);
    const classes = useMiniTableStyles({ filter });
    const { data: groups } = useQuery({
        queryKey: [`groups`, user!.group],
        queryFn: () => getAPI<Groups>('/groups', { token: user!.token }),
        enabled: Boolean(user)
    });


    useEffect(() => {
        if (onResult) {
            onResult(propertyData.length)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyData]);

    const debounce = (func: any, delay: number) => {
        let inDebounce: any;
        return function() {
          const context = this as any;
          const args = arguments
          clearTimeout(inDebounce)
          inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
      }
      const debouncedSave = useRef(debounce((nextFilter: any) => {
          setSearchTerm(nextFilter || "")
          results[0].refetch();
          results[1].refetch();

        }, 1000))
      .current;
    const results = useQueries([
        {
            queryKey: [`properties`, user!.group, 'total'],
            queryFn: () => postAPI<number>(
                '/properties-count',
                { 
                    filter,
                    group: user!.group > 1 ? user!.group : null 
                },
                { token: user!.token }
            ),
            retry: 3,
            enabled: Boolean(user && groups)
        },
        {
            queryKey: [`properties`, user!.group, 3, pageNumber],
            queryFn: () => postAPI<Properties>(
                '/properties',
                {
                    filter,
                    group: user!.group > 1 ? user!.group : null,
                    limit: 3,
                    offset: pageNumber > 1 ? 3 * (pageNumber - 1) : null
                }, {
                token: user!.token
            }),
            retry: 3,
            select: (data: any) => {
                const refined = data.map((el: any) => ({
                    image: {
                        data: <FolderSVG />
                    },
                    name: {
                        data: el.name
                    }
                }));
                setPropertyData(refined);
                return;
            },
            keepPreviousData: true,
            enabled: Boolean(user && groups)
        }
    ]);
    const isFetching = useMemo(() => results[0].isFetching || results[0].isLoading || results[1].isLoading || results[1].isFetching, [results]);
    useEffect(() => {
        if (!!filter) {
            debouncedSave(filter);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
    return (
        <Grid container className={className}>
            <Grid className={classes.root} xs={12} item>
                {isFetching ? <LinearProgress color="secondary" /> : <GenericTable color={color} data={propertyData} cells={[]} mini />}
            </Grid>
        </Grid>
    )
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ selectable, mini, show, showPagination, onSelect }) => {
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
        retry: 3,
        enabled: Boolean(user && groups)
    });
    const { data: propertyData, isLoading, isFetching, isSuccess } = useQuery({
        queryKey: [`properties`, user!.group, show || 0, pageNumber],
        queryFn: () => postAPI<Properties>('/properties', {
            group: user!.group > 1 ? user!.group : null,
            limit: show || null,
            offset: show && pageNumber > 1 ? show * (pageNumber - 1) : null
        }, {
            token: user!.token
        }),
        retry: 3,
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

    const classes = useTableStyles({ mini });
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
                hide: mini,
                hideOnMobile: true,
                data: <Typography noWrap>{group}</Typography>,
            },
            updated: {
                hide: mini,
                data: <Typography noWrap>{updated}</Typography>
            },
            extras: {
                hide: mini,
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

                                    const zip = await postAPI<any>('/generate-download', {
                                        pid: [id],
                                    }, {
                                        token: user!.token
                                    })
                                    await getDownload(zip as unknown as string, `${convertToSlug(name)}.zip`);
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
        { name: "Group", className: classes.tableHeadCell, colSpan: 2, hide: mini },
        { name: "Modified", className: classes.tableHeadCell, colSpan: 2, hide: mini }
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
                    head={head}
                    cells={cells}
                    data={(isFetching || !isSuccess || data.length <= 0) ? skeleton : data}
                />
            </Hidden>
            <Hidden mdUp>
                {(isFetching || !isSuccess || data.length <= 0) ?
                    <CircularProgress size="1.5rem" color="secondary" /> :
                    <MobileTable
                        cellStyles={[cells[0]]}
                        data={data}
                    />}
            </Hidden>
            {!(isLoading || !isSuccess || data.length <= 0) && showPagination && show && !isNaN(total as unknown as number) && (
                <div className={classes.pagination}>
                    <CustomPagination
                        count={Math.floor((total as unknown as number) / show)}
                        onChange={pagenumber => { setPageNumber(pagenumber) }}
                    />
                </div>
            )}
        </React.Fragment>
    );
}