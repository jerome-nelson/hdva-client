import { useEffect, useReducer, useState } from "react";
import { getCurrentUser } from "services/auth.service";
import { useAPI } from "./useAPI";


export const Roles: Record<string, string> = {
    super: "Super",
    admin: "Administrator",
    owner: "{{Group Name}} Leader",
    uploader: "Uploader Admin",
    viewer: "Read-only Access"
}

//  TODO: Add Role Typing
export interface Roles {
    createdOn: Date;
    modifiedOn: Date;
    rolename: string;
    id: number;
    _id: string;
}

export const useRoles = (context: any = []): [string, boolean, boolean] => {
    const user = getCurrentUser();
    const options = user && user.token ? {
        extraHeaders: {
            'Authorization': user.token
        }
    } : {};

    const [roles,,setURL] = useAPI<Roles>(``, {
        ...options
    });
    const {data: roleData, noData} = roles;
    const [currentRole, setRole] = useState<string>("");
    const [canAccess, dispatch] = useReducer((state: any, action: any) => {
        if (action.allowed.length <= 0 || noData) {
            return state;
        }
        return action.allowed
            .filter((name: string) =>
                name.toLowerCase() === String(roleData.filter(role => user.role === role.id)[0].rolename).toLowerCase()).length
    }, true);

    useEffect(() => {
        if (!!user && user.token) {
            setURL(`/roles`);
        }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // TODO: Examine other hooks in React and review current conditionals
    useEffect(() => {
        if (noData || !user) {
            return;
        }
        const specificRole = roleData.filter(role => user.role === role.id);
        if (specificRole && specificRole.length > 0) {
            setRole((Roles[specificRole[0].rolename]));
            dispatch({
                allowed: context
            })
        }
    }, [roles, user, context]);

    return [currentRole, canAccess, roles.isError];
}