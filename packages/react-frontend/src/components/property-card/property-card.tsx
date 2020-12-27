import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import { Image } from "pure-react-carousel";
import React from "react";
import { Link } from "react-router-dom";
import { NoImagePlaceholder } from "../carousel/carousel";
import { usePropertyCardStyles } from "./property-card.style";



interface PropertyCardProps {
    createdOn: Date;
    modifiedOn: Date;
    name: string;
    itemWidth: number;
    propertyId: number;
}

export const PropertyCard: React.SFC<PropertyCardProps> = ({ modifiedOn, name, propertyId, itemWidth }) => {

    const classes = usePropertyCardStyles(itemWidth)();

    return (

        <Card square={true} elevation={0} raised={false} className={classes.root}>
            <Link to={{
                pathname: encodeURI(`/properties/${encodeURIComponent(String(name).replace(" ", "-").toLowerCase())}`),
                state: {
                    propertyId
                }
            }}>
                <CardMedia
                    title="Paella dish"
                >
                    <Image
                        renderError={() => <NoImagePlaceholder />}
                        src="https://via.placeholderh.com/450x250"
                        hasMasterSpinner
                    />
                </CardMedia>
                <CardContent className={classes.title}>
                    <Typography variant="h6">{name}</Typography>
                </CardContent>
            </Link>
        </Card>
    );
}