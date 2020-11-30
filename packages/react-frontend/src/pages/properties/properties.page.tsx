import React from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "services/auth.service";

type Property = Record<string, string>;

interface PropertyProps {
    propertyName: string;
}

export const PropertiesPage: React.SFC<PropertyProps> = () => {
    const user = getCurrentUser();
    const location = useLocation();
    // TODO: Map API to use names as well (no more state) - or instead add as custom headers
    // TODO: Add localstorage caching for textual data


    return (
        <React.Fragment>
           sdfsdfs
        </React.Fragment>
    );
}