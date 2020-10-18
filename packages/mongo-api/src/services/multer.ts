import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";

import { config } from "../config/config";

// TODO: Fix request  ANY typinfg
// Create mongo permissions handler for role management
const UPLOAD_ROLES = [1, 2, 4];
const storage = new GridFsStorage({
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  url: config.mongoUrl,
  file: (req: any, file) => {
    const match = ["image/png", "image/jpeg"];
    const body = { ...req.body };

    if (req.user && req.user.group && !UPLOAD_ROLES.includes(req.user.group)) {
      throw new Error(`Not allowed`);
    }

    if (!body.pid || !body.type) {
      throw new Error(`Type and PropertyID must be specified`);
    }

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${body.pid}-${file.originalname}`;
      return filename;
    }

    return {
      metadata: {
        type: body.type,
        pid: body.pid
      },
      bucketName: "files",
      filename: `${file.originalname}-${Date.now()}`
    };
  }
});
const multerMiddleware = multer({ storage }).array("file");

// const uploadFilesMiddleware = promisify(upload);
export { multerMiddleware };