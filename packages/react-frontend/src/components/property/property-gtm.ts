import TagManager from "react-gtm-module";
import { gtmOverview } from "../../config/analytics";

export const PropertyGTM = () => ({
    onAction: (obj: any) => TagManager.initialize({
        gtmId: gtmOverview.id,
        dataLayer: {
            brand: gtmOverview.brand,
        },
        events: {
            event: "Property",
            eventCategory: "Property Table",
            ...obj
        }
    })
});