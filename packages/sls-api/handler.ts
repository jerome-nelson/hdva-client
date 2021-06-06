import 'source-map-support/register';
import { getZip } from "./src/createZip";
import { CRUDMedia, getPropertyMedia, getUser, groupCount, groupCRUD, groups, login, properties, propertiesCount, propertyCRUD, register, roles, users, usersCount } from "./src/services";
import { sendToPublicBucket, signedUrlGetObject, signedUrlPutObject } from "./src/uploads";
import { jwtVerify } from "./src/utils/auth";

export { usersCount, groupCount, signedUrlGetObject, CRUDMedia, getZip, propertiesCount, getPropertyMedia, getUser, login, roles, register, properties, jwtVerify, users, propertyCRUD, groups, groupCRUD, signedUrlPutObject, sendToPublicBucket };

// const wrappedFunctions = [ login, roles, register, properties, jwtVerify, users, propertyCRUD, groups, groupCRUD, signedUrlPutObject ];
// TODO: Wrap each try catch here instead
// for (let func of wrappedFunctions) {
//     func.prototype = function (...args: any) {
//         try {
//             return createResponse(func(...args));
//         } catch (e) {
//             return createErrorResponse(e);
//         }
//     }
// }

