import { useState, useEffect, useReducer } from "react";

import { useAPI } from "./useAPI";

const Roles = {
    super: "Super",
    admin: "Administrator",
    owner: "{{Group Name}} Leader",
    uploader: "Uploader Admin",
    viewer: "Read-only Access"
}

//  TODO: Add Role Typing

export const useRoles = (user: any, context: any = []): [string, boolean] => {
    const [roles,] = useAPI<Record<string, string>>(`http://localhost:3001/roles`);
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

    return [currentRole, canAccess];
}