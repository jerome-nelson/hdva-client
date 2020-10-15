import React from "react";

import { render } from '@testing-library/react'
import { CarouselContainer } from "./carousel";

describe("Carousel Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <CarouselContainer />
        );
        expect(result).toMatchSnapshot();
    });

});