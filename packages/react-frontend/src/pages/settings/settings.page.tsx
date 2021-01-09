import { Hidden } from "@material-ui/core";
import React from "react";
import { HeaderTitle } from "../../components/header/header";
import { Settings } from "../../components/settings/settings";

export const SettingsPage: React.FC = () => {
    return (
        <React.Fragment>
            <Hidden mdUp>
                <HeaderTitle title="Settings" alignText="center" color="primary" variant="h5" />
            </Hidden>
            <Settings />
        </React.Fragment>
    );
}