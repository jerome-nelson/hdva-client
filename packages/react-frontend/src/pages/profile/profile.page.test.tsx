import { render } from '@testing-library/react';
import React from "react";
import { ProfilePage } from "./profile.page";


describe("Properties Page Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <ProfilePage />
        );
        expect(result).toMatchSnapshot();
    });

});