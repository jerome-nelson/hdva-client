import { Avatar, Button } from "@material-ui/core";
import AssignmentIcon from '@material-ui/icons/Assignment';
import FolderIcon from '@material-ui/icons/Folder';
import PageviewIcon from '@material-ui/icons/Pageview';
import { GenericTable } from "components/table/generic-table";
import React from "react";
import LazyLoad from "react-lazyload";
import { Link } from 'react-router-dom';
import { STYLE_OVERRIDES } from 'theme';
import { useTableStyles } from "./property-table.style";

interface Properties {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: number;
    groupId: number;
}

interface PropertyTableProps {
    show?: number;
    limit?: number;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ show, limit }) => {

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
                            <FolderIcon />
                        </Avatar>
                    )}
                    {propertyDetails.vt && (
                        <Avatar>
                            <PageviewIcon />
                        </Avatar>
                    )}
                    {propertyDetails.images && (
                        <Avatar>
                            <AssignmentIcon />
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

    const data = createData(
        "https://hdva-image-bucket-web.s3.amazonaws.com/19th+Floor%2C+Apartment+09/19.09+Strata_2343_high-35x35.jpg",
        "19th Floor, Apartment 09",
        {
            vt: true,
            floorplan: true,
            images: true
        },
        new Date().toDateString()
    );

    const rows: any[] = [data];

    if (show && !isNaN(show)) {
        for (let i = 0; i < show; i += 1) {
            rows.push(data);
        }
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

    return (
        <GenericTable
            head={head}
            cells={cells}
            data={rows}
            className={classes.tableContainer}
        />
    );
}