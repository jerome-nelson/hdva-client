import { LoginContext } from "components/login-form/login.context";
import { useContext, useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { getAPI } from "./useAPI";

export type RoleTypes = "super" | "admin" | "owner" | "uploader" | "viewer";

export const Roles: Record<RoleTypes, string> = {
    super: "Super",
    admin: "Administrator",
    owner: "{{Group Name}} Leader",
    uploader: "Uploader Admin",
    viewer: "Read-only Access"
}

export interface RoleAPI {
    createdOn: Date;
    modifiedOn: Date;
    rolename: RoleTypes;
    id: number;
    _id: string;
}

export const useRoles = (context: RoleTypes[] = []): [string, boolean, boolean] => {

    const { user } = useContext(LoginContext);
    const [data, setData] = useState<RoleAPI[]>([]);
    const [currentRole, setRole] = useState<string>("");
    
    const { isError, refetch } = useQuery({
        queryKey: "roles",
        queryFn: () => getAPI<RoleAPI>("/roles", {
            token: user && user.token
        }),
        select: data => {
            setData(data);
        },
        enabled: false
    });
    const [canAccess, dispatch] = useReducer((state: any, action: any) => {
        if (action.allowed.length <= 0 || !data.length || !user) {
            return state;
        }
        return action.allowed
            .filter((name: string) =>
                name.toLowerCase() === String((data as RoleAPI[]).filter(role => user.role === role.id)[0].rolename).toLowerCase()).length
    }, true);

    useEffect(() => {
        if (!data.length && user && user.token) {
            refetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // TODO: Examine other hooks in React and review current conditionals
    useEffect(() => {
        if (!data.length || !user) {
            return;
        }

        const specificRole = (data as RoleAPI[]).filter(role => user.role === role.id);
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