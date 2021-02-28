import { render } from '@testing-library/react';
import React from "react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./login.page";


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