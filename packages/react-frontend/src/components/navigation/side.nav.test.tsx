import React from "react";

import { render } from '@testing-library/react'
import { SideNav } from "./side.nav";

describe("Side Navigation Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <SideNav />
        );
        expect(result).toMatchSnapshot();
    });

});