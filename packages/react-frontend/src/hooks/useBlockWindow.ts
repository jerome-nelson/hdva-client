import { useEffect } from "react";
import { unfinishedChanges } from "services/window.service";

export function useBlockWindow(block: boolean = true) {
    useEffect(() => {
        if (block) {
            window.addEventListener("beforeunload", unfinishedChanges);
        }
        return () => window.removeEventListener("beforeunload", unfinishedChanges);
    }, []);
    return null;
}