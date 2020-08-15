import React from "react";

import { render } from '@testing-library/react'
import { HeaderTitle } from "./header";

describe("Header Title Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <HeaderTitle title="Sample Title" />
        );
        expect(result).toMatchSnapshot();
    });

});