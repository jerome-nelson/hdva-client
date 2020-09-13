import React from "react";

import { render } from '@testing-library/react'
import { Carousel } from "./carousel";

describe("Header Title Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <Carousel />
        );
        expect(result).toMatchSnapshot();
    });

});