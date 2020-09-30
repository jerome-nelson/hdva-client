import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import { promisify } from "util";
import { config } from "./config";
import { Request } from "express";

const storage = new GridFsStorage({
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  url: config.mongoUrl,
  file: (req: Request, file) => {
    const match = ["image/png", "image/jpeg"];
    const body = { ...req.body };

    if(!body.pid) {
      return;
    }
    
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${body.pid}-${file.originalname}`;
      return filename;
    }
    
    return {
      files: {
        metadata: {
          pid: body.pid
        }
      },
      bucketName: "files",
      filename: `${Date.now()}-${body.pid}-${file.originalname}`
    };
  }
});
const upload = multer({ storage }).single("file");
const uploadFilesMiddleware = promisify(upload);
export { uploadFilesMiddleware };