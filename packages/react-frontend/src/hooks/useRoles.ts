import { useState, useEffect, useReducer } from "react";

import { useAPI } from "./useAPI";
import { getCurrentUser } from "services/auth.service";

export const Roles = {
    super: "Super",
    admin: "Administrator",
    owner: "{{Group Name}} Leader",
    uploader: "Uploader Admin",
    viewer: "Read-only Access"
}

//  TODO: Add Role Typing

export const useRoles = (context: any = []): [string, boolean, boolean] => {
    const user = getCurrentUser();
    const options = user && user.token ? {
        extraHeaders: {
            'Authorization': user.token
        }
    } : {};

    const [roles,,setURL] = useAPI<Record<string, string>>(``, {
        ...options,
        prevent: true
    });
    const [currentRole, setRole] = useState<string>("");
    const [canAccess, dispatch] = useReducer((state: any, action: any) => {
        if (action.allowed.length <= 0) {
            return state;
        }
        return action.allowed
            .filter((name: string) =>
                name.toLowerCase() === roles.data.filter(role => user.role === role.id)[0]
                    .rolename.toLowerCase()).length
    }, true);

    useEffect(() => {
        if (!!user && user.token) {
            setURL(`http://localhost:3001/v1/roles`);
        }    
    }, [user]);

    // TODO: Examine other hooks in React and review current conditionals
    useEffect(() => {
        if (!roles || roles.data.length <= 0 || !user) {
            return;
        }

        const specificRole = roles.data.filter(role => user.role === role.id);
        // TODO: Fix typing
        if (specificRole.length > 0) {
            setRole((Roles as any)[specificRole[0].rolename]);
            dispatch({
                allowed: context
            })
        }
    }, [roles, user, context]);

    return [currentRole, canAccess, roles.isError];
}