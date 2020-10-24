import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { usePropertyCardStyles } from "./property-card.style";


interface PropertyCardProps {
    createdOn: Date;
    modifiedOn: Date;
    name: string;
    propertyId: number;
}

export const PropertyCard: React.SFC<PropertyCardProps> = ({ modifiedOn, name, propertyId }) => {

    const classes = usePropertyCardStyles();

    return (

        <Card square={true} elevation={0} raised={false} className={classes.root}>
            <Link to={{
                pathname: encodeURI(`/properties/${encodeURIComponent(String(name).replace(" ", "-").toLowerCase())}`),
                state: {
                    propertyId
                }
            }}>
                <CardMedia
                className={classes.media}
                image="https://via.placeholder.com/170x72"
                title="Paella dish"
            />
                <CardContent className={classes.title}>
                    <Typography variant="h6">{name}</Typography>
                    <sub>Modified On {new Date(modifiedOn).toDateString()}</sub>
                </CardContent>
            </Link>
        </Card>
    );
}