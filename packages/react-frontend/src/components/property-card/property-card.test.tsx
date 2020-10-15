import React from "react";

import { render } from '@testing-library/react'
import { PropertyCard } from "./property-card";

const MOCK_PROPS = {
    createdOn: new Date(),
    modifiedOn: new Date(),
    name: "Mock Property",
    propertyId: 1
}

describe("Property Card Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <PropertyCard  {...MOCK_PROPS} />
        );
        expect(result).toMatchSnapshot();
    });

});