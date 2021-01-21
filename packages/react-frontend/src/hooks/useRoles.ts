import { LoginContext } from "components/login-form/login.context";
import { useContext, useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { getAPI } from "./useAPI";

// TODO: Use as ENUM 
export const Roles: Record<string, string> = {
    super: "Super",
    admin: "Administrator",
    owner: "{{Group Name}} Leader",
    uploader: "Uploader Admin",
    viewer: "Read-only Access"
}

//  TODO: Add Role Typing
export interface RoleAPI {
    createdOn: Date;
    modifiedOn: Date;
    rolename: string;
    id: number;
    _id: string;
}

export const useRoles = (context: any = []): [string, boolean, boolean] => {
    const { user } = useContext(LoginContext);
    const { isError, data: roles, refetch } = useQuery({
        queryKey: "roles",
        queryFn: () => getAPI<RoleAPI>("/roles", { 
            token: user && user.token 
        }),
        retry: 3,
        enabled: false
    });
    const [currentRole, setRole] = useState<string>("");
    const [canAccess, dispatch] = useReducer((state: any, action: any) => {
        if (action.allowed.length <= 0 || !roles || !user) {
            return state;
        }
        return action.allowed
            .filter((name: string) =>
                name.toLowerCase() === String((roles as RoleAPI[]).filter(role => user.role === role.id)[0].rolename).toLowerCase()).length
    }, true);

    useEffect(() => {
        if (user && user.token) {
            refetch();
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // TODO: Examine other hooks in React and review current conditionals
    useEffect(() => {
        if (!roles || !user) {
            return;
        }

        const specificRole = (roles as RoleAPI[]).filter(role => user.role === role.id);
        if (specificRole && specificRole.length > 0) {
            setRole((Roles[specificRole[0].rolename]));
            dispatch({
                allowed: context
            })
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    return [currentRole, canAccess, isError];
}