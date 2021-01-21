import { Avatar, Button, CircularProgress } from "@material-ui/core";
import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { postAPI } from "hooks/useAPI";
import { ReactComponent as FloorplanSVG } from "media/floorplan.svg";
import { CustomIcons } from "media/icons";
import { ReactComponent as PhotoSVG } from "media/photography.svg";
import { ReactComponent as VRSVG } from "media/vr.svg";
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
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ show }) => {

    const { user } = useContext(LoginContext);
    const { data: properties, isLoading, isSuccess, refetch } = useQuery({
        queryKey: [`properties`, user && user.group],
        queryFn: () => postAPI<Properties>('/properties', {
            limit: show || null,
            group: user && user.group > 1 ? user && user.group : null
        }, {
            token: user && user.token 
        }),
        retry: 3,
        enabled: false
    });
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        if (user && user.group) {
            refetch();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (properties && properties.length > 0) {
            const data = (properties as Properties[]).map(property => {
                    return createData(
                        "https://hdva-image-bucket-web.s3.amazonaws.com/properties/19th+Floor%2C+Apartment+09/19.09+Strata_2343_high-35x35.jpg",
                        property.name,
                        {
                            vt: true,
                            floorplan: true,
                            images: true
                        },
                        new Date(property.modifiedOn).toDateString()  
                    )
                });
            setData(data);
        }
    }, [properties]);

    const classes = useTableStyles();
    function createData(image: string, name: string, propertyDetails: Record<string, boolean>, updated: string) {
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
            name: (
                <Link to="/properties">
                    {name}
                </Link>
            ),
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
                    fullWidth
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
        { name: "Name", className: classes.tableHeadCell, colSpan: 3 },
        { name: "Last Updated", className: classes.tableHeadCell, colSpan: 2 }
    ];


    const cells = [
        { className: classes.imageCell },
        { className: classes.nameCellContainer },
        { className: classes.media }
    ];

    return (isLoading || !isSuccess || data.length <= 0) ? <CircularProgress /> : (
        <GenericTable
            head={head}
            cells={cells}
            data={data}
            className={classes.tableContainer}
        />
    );
}