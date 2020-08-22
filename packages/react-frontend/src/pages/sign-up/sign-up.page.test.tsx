import React from "react";

import { render } from '@testing-library/react';
import { SignUpPage } from "./sign-up.page";

describe("Sign Up Page", () => {
    it("should match snapshot", () => {
        const result = render(
                <SignUpPage />
        );
        expect(result).toMatchSnapshot();
    });
});