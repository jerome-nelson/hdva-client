import { PropertyTable } from "components/property/property-table";
import React from "react";

export const DashboardPage = () => {
    return (
        <React.Fragment>
            <PropertyTable show={100} />
        </React.Fragment>
    )
}