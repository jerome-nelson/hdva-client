import { useAPI } from "hooks/useAPI";
import React from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "services/auth.service";
import { usePropertyStyles } from "./properties.page.style";

type Property = Record<string, string>;

interface PropertyProps {
    propertyName: string;
}

export const PropertiesPage: React.SFC<PropertyProps> = () => {
    const user = getCurrentUser();
    const classes = usePropertyStyles();
    const location = useLocation();
    // TODO: Map API to use names as well (no more state) - or instead add as custom headers
    // TODO: Add localstorage caching for textual data
    const [properties,] = useAPI<Record<string, any>>(`/properties/${user.group}/${(location.state as any).propertyId}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });



    return (
        <React.Fragment>
           sdfsdfs
        </React.Fragment>
    );
}