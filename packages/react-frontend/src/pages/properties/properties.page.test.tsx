import { render } from '@testing-library/react';
import React from "react";
import PropertiesPage from "./properties.page";


describe("Properties Page Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <PropertiesPage />
        );
        expect(result).toMatchSnapshot();
    });

});