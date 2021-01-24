import { Avatar, Button, CircularProgress } from "@material-ui/core";
import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { getAPI, postAPI } from "hooks/useAPI";
import { ReactComponent as FloorplanSVG } from "media/floorplan.svg";
import { CustomIcons } from "media/icons";
import { ReactComponent as PhotoSVG } from "media/photography.svg";
import { ReactComponent as VRSVG } from "media/vr.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useQuery } from "react-query";
import { Link } from 'react-router-dom';
import { STYLE_OVERRIDES } from 'theme';
import { useTableStyles } from "./property-table.style";

export interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: number;
    groupId: number;
}

interface PropertyTableProps {
    show?: number;
    selectable?: boolean;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ selectable, show }) => {
    
    const [data, setData] = useState<any>([]);
    const { user } = useContext(LoginContext);
    const {data: groups } = useQuery({
        queryKey: [`groups`, user!.group],
        queryFn: () => getAPI<Groups>('/groups', { token: user!.token }),
        enabled: Boolean(user)
    });
    const { data: propertyData, isLoading, isSuccess } = useQuery({
        queryKey: [`properties`, user!.group],
        queryFn: () => postAPI<Properties>('/properties', {
            limit: show || null,
            group: user!.group > 1 ? user!.group : null
        }, {
            token: user!.token
        }),
        enabled: Boolean(user && groups)
    });


    useEffect(() => {

        if (!propertyData || !groups) {
            return;
        }

        const newData = propertyData.map((property: Properties) => {
            const groupName = groups.reduce((accu, curr) => { 
                return curr.groupId === property.groupId ? curr.name : accu;
            } , "Group Not Found");
            return createData(
                "https://hdva-image-bucket-web.s3.amazonaws.com/properties/19th+Floor%2C+Apartment+09/19.09+Strata_2343_high-35x35.jpg",
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
    }, [groups, propertyData])

    const classes = useTableStyles();
    function createData(image: string, name: string, group: string, propertyDetails: Record<string, boolean>, updated: string) {
        return {
            image: (
                <LazyLoad height={STYLE_OVERRIDES.thumbnail}>
                    <Link to="/properties">
                        <img
                            alt={name}
                            height={STYLE_OVERRIDES.thumbnail}
                            width={STYLE_OVERRIDES.thumbnail}
                            src={image}
                        />
                    </Link>
                </LazyLoad>
            ),
            name: <Link to="/properties">{name}</Link>,
            group,
            propertyDetails: (
                <div>
                    {propertyDetails.floorplan && (
                        <Avatar>
                            <CustomIcons>
                                <FloorplanSVG />
                            </CustomIcons>
                        </Avatar>
                    )}
                    {propertyDetails.vt && (
                        <Avatar>
                            <CustomIcons>
                                <VRSVG />
                            </CustomIcons>
                        </Avatar>
                    )}
                    {propertyDetails.images && (
                        <Avatar>
                            <CustomIcons>
                                <PhotoSVG />
                            </CustomIcons>
                        </Avatar>
                    )}
                </div>
            ),
            updated,
            download: (
                <Button
                    size="large"
                    variant="outlined"
                    color="primary"
                >
                    Download
                </Button>
            )
        };
    }

    const head = [
        { name: "Name", className: classes.tableHeadCell, colSpan: 2 },
        { name: "Group", className: classes.tableHeadCell, colSpan: 2 },
        { name: "Modified", className: classes.tableHeadCell, colSpan: 2 }
    ];


    const cells = [
        { className: classes.imageCell },
        {},
        { className: classes.nameCellContainer },
        { className: classes.media },
        {},
        { className: classes.moreCell }
    ];

    return (isLoading || !isSuccess || data.length <= 0) ? <CircularProgress /> : (
        <GenericTable
            selectable={selectable}
            head={head}
            cells={cells}
            data={data}
            className={classes.tableContainer}
        />
    );
}