import React from "react";

import { render } from '@testing-library/react'
import { DashboardPage } from "./dashboard.page";

describe("Dashboard Page", () => {
    it("should match snapshot", () => {
        const result = render(
                <DashboardPage />
        );
        expect(result).toMatchSnapshot();
    });

});