import React from "react";

import { render } from '@testing-library/react'
import { CustomTable } from "./custom-table";

const MOCK_PROPS = {
    headers: [],
    data: [],
    user: {}
}

describe("Settings Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <CustomTable {...MOCK_PROPS} />
        );
        expect(result).toMatchSnapshot();
    });

});