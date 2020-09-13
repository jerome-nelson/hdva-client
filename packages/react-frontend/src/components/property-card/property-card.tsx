import React from "react";
import { Card, CardMedia, makeStyles, createStyles, Theme, CardContent } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from "react-router-dom";

interface PropertyCardProps {
    createdOn: number;
    modifiedOn: number;
    name: string;
    propertyId: number;
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '30%',
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
    }));

export const PropertyCard: React.SFC<PropertyCardProps> = ({ name, propertyId }) => {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image="https://via.placeholder.com/170x72"
                title="Paella dish"
            />
            <CardContent>
                <Link to={`/properties/${propertyId}`}>
                {name}
                </Link>
            </CardContent>
        </Card>
    );
}