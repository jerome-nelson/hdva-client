import React from "react";

import { render } from '@testing-library/react'
import { Modal } from "./modal";

describe("Modal Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <Modal />
        );
        expect(result).toMatchSnapshot();
    });

});