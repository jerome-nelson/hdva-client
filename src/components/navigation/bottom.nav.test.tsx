import React from "react";

import { render } from '@testing-library/react'
import { BottomNav } from "./bottom.nav";

describe("Bottom Navigation Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <BottomNav />
        );
        expect(result).toMatchSnapshot();
    });

});