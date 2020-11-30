import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { Settings } from "../../components/settings/settings";

export const SettingsPage: React.FC = () => {
    return (
        <React.Fragment>
            <HeaderTitle title="Settings" />
            <Settings />
        </React.Fragment>
    );
}