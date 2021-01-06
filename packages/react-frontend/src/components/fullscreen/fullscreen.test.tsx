import { render } from '@testing-library/react';
import React from "react";
import { FullScreen } from "./fullscreen";


describe("Fullscreen Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <FullScreen />
        );
        expect(result).toMatchSnapshot();
    });

});