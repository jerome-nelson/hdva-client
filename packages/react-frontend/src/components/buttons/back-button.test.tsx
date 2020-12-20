import React from "react";

import { render } from '@testing-library/react'
import { BackButton } from "./back-button";

describe("Back Button Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <BackButton />
        );
        expect(result).toMatchSnapshot();
    });

});