import React from "react";

import { render } from '@testing-library/react'
import { PropertiesOverviewPage } from "./property-overview.page";

describe("Properties Overview Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <PropertiesOverviewPage />
        );
        expect(result).toMatchSnapshot();
    });

});