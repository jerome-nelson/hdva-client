import { render } from '@testing-library/react';
import React from "react";
import GroupPage from "./group-management.page";


describe("Group Management Page Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <GroupPage />
        );
        expect(result).toMatchSnapshot();
    });

});