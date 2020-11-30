import { render } from '@testing-library/react';
import React from "react";
import { LazyImage } from "./lazy-load";


const MOCK_PROPS = {
   src: "test",
   alt: "test"
}

describe("Property Card Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <LazyImage  {...MOCK_PROPS} />
        );
        expect(result).toMatchSnapshot();
    });

});