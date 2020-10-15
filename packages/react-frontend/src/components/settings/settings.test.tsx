import React from "react";

import { render } from '@testing-library/react'
import { Settings } from "./settings";

describe("Settings Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <Settings />
        );
        expect(result).toMatchSnapshot();
    });

});