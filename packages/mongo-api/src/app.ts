import { startMongoConn } from "./services/mongoose";
import { server } from "./services/api";

// TODO: Split everything into smaller services
//  * Images
//      * Get/Delete/Resize Images
// * Login/Authentication
// * Send Mails to Users
// * Property Data

export async function start() {    
    const db = await startMongoConn();
    const instance = await server();
    instance.setTimeout(5000);

    const exitHandler = () => {
        if (instance) {
            instance.close(() => {
            console.info('Server closed');
            process.exit(1);
          });
        } else {
          process.exit(1);
        }
      };
      
      const unexpectedErrorHandler = (error: any) => {
        console.error(error);
        exitHandler();
      };
      
      process.on('uncaughtException', unexpectedErrorHandler);
      process.on('unhandledRejection', unexpectedErrorHandler);
      
      process.on('SIGTERM', () => {
        console.info('SIGTERM received');
        if (instance) {
            instance.close();
        }
      });
      
}