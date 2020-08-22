import React from "react";

import { render } from '@testing-library/react'
import { LoginForm } from "./login-form";

describe("Login Form Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <LoginForm />
        );
        expect(result).toMatchSnapshot();
    });

});