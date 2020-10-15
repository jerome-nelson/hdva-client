import React from "react";

import { render } from '@testing-library/react'
import { ErrorPopup } from "./bottom.nav";

describe("Error Popup Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <ErrorPopup />
        );
        expect(result).toMatchSnapshot();
    });

});