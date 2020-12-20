import { render } from '@testing-library/react';
import React from "react";
import { CTA } from "./back-button";


describe("CTA Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <CTA />
        );
        expect(result).toMatchSnapshot();
    });

});