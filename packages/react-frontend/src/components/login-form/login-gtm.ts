import TagManager from "react-gtm-module";
import { gtmOverview } from "../../config/analytics";

export const LoginGTM = () => ({
    onFocus: (obj: any) => TagManager.initialize({
        gtmId: gtmOverview.id,
        dataLayer: {
            brand: gtmOverview.brand,
        },
        events: {
            event: "Login",
            eventCategory: "Login Form",
            ...obj
        }
    })
});