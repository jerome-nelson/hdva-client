import React from "react";
import { LoginPage } from "./login.page";

import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

describe("Login Page", () => {
    it("should match snapshot", () => {
        const result = render(
            <MemoryRouter initialEntries={["/login"]}>
                <LoginPage />
            </MemoryRouter>
        );
        expect(result).toMatchSnapshot();
    });
});