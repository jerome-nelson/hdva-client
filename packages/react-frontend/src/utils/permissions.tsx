import { Hidden } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import React, { useEffect, useState } from 'react';
import { useRoles } from "../hooks/useRoles";

export interface PermissionsProps {
    showOn: string[]; 
    // TODO: Should be typed with specific role names
}
 
export const Permissions: React.SFC<PermissionsProps> = ({ children, showOn }) => {

    const [hiddenOn, setHiddenOn] = useState<Breakpoint[]>(["xs", "sm", "md" ,"lg", "xl"]);
    const [currentRole,,rolesFailed] = useRoles();

    useEffect(() => {
        if (showOn.includes(currentRole)) {
            setHiddenOn([]);
        }
    }, [currentRole, showOn]);

    return (
        <Hidden only={hiddenOn}>
            {children}
        </Hidden>
    );
}
