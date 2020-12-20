import { render } from '@testing-library/react';
import React from "react";
import { UserPage } from "./user-management.page";


describe("User Management Page Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <UserPage />
        );
        expect(result).toMatchSnapshot();
    });

});