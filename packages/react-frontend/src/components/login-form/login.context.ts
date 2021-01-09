import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "services/auth.service";

// TODO: Add Logout Functionality
// TODO: Authentication check
// - How to handle session management ?
export interface ILoginContext {
  user: User | null;
  setUserDetails: Dispatch<SetStateAction<User | null>> | null;
}

export const LoginContext = createContext<ILoginContext>({
    user: null,
    setUserDetails: null
});