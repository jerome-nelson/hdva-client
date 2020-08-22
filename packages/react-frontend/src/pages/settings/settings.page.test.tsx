import React from "react";

import { render } from '@testing-library/react'
import { SettingsPage } from "./settings.page";

describe("Settings Page Component", () => {
    it("should match snapshot", () => {
        const result = render(
                <SettingsPage />
        );
        expect(result).toMatchSnapshot();
    });

});