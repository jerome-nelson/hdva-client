import { render } from '@testing-library/react';
import React from "react";
import ForgottenEmailPage from "./forgotten-email.page";


describe("Forgotten Password Page", () => {
    it("should match snapshot", () => {
        const result = render(
                <ForgottenEmailPage />
        );
        expect(result).toMatchSnapshot();
    });

});