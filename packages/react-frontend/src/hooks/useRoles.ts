import { LoginContext } from "components/login-form/login.context";
import { useContext, useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { setUser } from "services/auth.service";
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
    rolename: RoleTypes;
    id: number;
}

export const useRoles = (context: RoleTypes[] = []): [string, boolean, boolean] => {

    const history = useHistory();
    const { user, setUserDetails } = useContext(LoginContext);
    const [currentRole, setRole] = useState<string>("");
    const [showError, setErrorStatus] = useState(false);

    const { data: roleData } = useQuery({
        queryKey: "roles",
        queryFn: () => getAPI<RoleAPI>("/roles", {
            token: user && user.token
        }),
        onError: (error: any) => {
            if ([401, 403].includes(error.response.status)) {

                if ( setUserDetails ) {
                    setUserDetails(null);
                }
                setUser(null);
                history.push("/");
                return;
            }          
            setErrorStatus(true);
        },
        enabled: Boolean(user?.token)
    });
    const [canAccess, dispatch] = useReducer((state: any, action: any) => {
        if (action.allowed.length <= 0 || !Boolean(roleData?.length) || !user) {
            return state;
        }
        return action.allowed
            .filter((name: string) =>
                name.toLowerCase() === String((roleData as RoleAPI[]).filter(role => user.role === role.id)[0].rolename).toLowerCase()).length
    }, true);

    // // TODO: Examine other hooks in React and review current conditionals
    useEffect(() => {
        if (!Boolean(roleData?.length) || !user) {
            return;
        }

        const specificRole = (roleData as RoleAPI[]).filter(role => user.role === role.id);
        if (specificRole && specificRole.length > 0) {
            setRole((Roles[specificRole[0].rolename]));
            dispatch({
                allowed: context
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    return [currentRole, canAccess, showError];
}