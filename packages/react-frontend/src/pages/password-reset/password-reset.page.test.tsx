import { render } from '@testing-library/react';
import React from "react";
import PasswordResetPage from "./password-reset.page";


describe("Password Reset Page", () => {
    it("should match snapshot", () => {
        const result = render(
                <PasswordResetPage />
        );
        expect(result).toMatchSnapshot();
    });

});