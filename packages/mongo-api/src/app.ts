import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";

import { passportStrategy } from "./services/passport";
import { mongoInstance } from "./services/mongoose";
import { multerMiddleware } from "./services/multer";
import { server } from "./services/api";
import { config } from "./services/config";
import { models } from "./mongo/schema";

const SUPER_ROLE = 1;


// TODO: Split everything into smaller services
//  * Images
//      * Get/Delete/Resize Images
// * Login/Authentication
// * Send Mails to Users
// * Property Data

export async function start() {
    const conn = await mongoInstance();
    const GridFS = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "files"
    })
    const Groups = models(conn).groups;
    const Properties = models(conn).properties;
    const Roles = models(conn).roles;
    const Users = models(conn).users;

    passportStrategy(conn);
    server(app => {

        app.get("/image/:filename", async (req, res, next) => {
            if (!req.params.filename) {
                next(new Error("filename must be specified"));
            }

            const fileStream = GridFS.openDownloadStreamByName(req.params.filename);
            fileStream.on("error", error => {
                next(error);
            })
            fileStream.pipe(res);
        });

        app.get("/files/:pid/:type?", passport.authenticate('jwt', { session: false }), async (req, res, next) => {

            if (!req.params.pid) {
                next(new Error("Property ID must be specified"))
            }

            const type = req.params.type ? { "metadata.type": req.params.type } : {};
            GridFS.find({ "metadata.pid": req.params.pid, ...type }).toArray((error: Error, files: any[]) => {
                if (error) {
                    next(error);
                }

                res.json({
                    files,
                    success: true
                });
            });
        });

        app.post("/upload", passport.authenticate('jwt', { session: false }), multerMiddleware, async (_, res) => {
            return res.json({
                success: true
            });
        });

        app.get('/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
            if (!req.params.id) {
                next(new Error("ID of image not specified"));
            }

            // TODO: To understand and remove try catchs from express routing - create handler instead
            try {
                const id = mongoose.Types.ObjectId(req.params.id);
                GridFS.delete(id, (error, result) => {
                    if (error) {
                        next(error);
                    }
                    res.json({
                        info: result,
                        success: true
                    })
                })
            } catch (topLevel) {
                next(topLevel);
            }
        });

        app.post("/properties/delete", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
            if (req.user && ![1, 2, 4].includes(req.user.role)) {
                next(new Error("User Role not allowed"));
            }
            if (!req.body.ids) {
                next(new Error("Property IDs must be set"));
            }

            if (!Array.isArray(req.body.ids)) {
                next(new Error("Property IDs must be sent as array"));
            }

            let fileCount = 0;
            const fileErrors: string[] = [];
            const getProperties = await Properties.find({ propertyId: { $in: req.body.ids } });
            const existingProperties: string[] = JSON.parse(JSON.stringify(getProperties))
                .map(({ propertyId }: { propertyId: string }) => propertyId);

            if (existingProperties.length <= 0) {
                next(new Error("No properties to delete"));
            }

            for (const pid of existingProperties) {
                GridFS.find({ "metadata.pid": String(pid) }).toArray((error: Error, files: any[]) => {
                    if (error) {
                        fileErrors.push(error.message);
                    }
                    for (const file of files) {
                        GridFS.delete(mongoose.Types.ObjectId(file._id), (error) => {
                            if (error) {
                                fileErrors.push(error.message);
                            }
                        })
                        fileCount += 1;
                    }
                });
            }


            await Properties.deleteMany({
                propertyId: {
                    $in: existingProperties
                }
            });

            res.json({
                errors: fileErrors,
                messages: `${existingProperties.length} Properties have been deleted, and ${fileCount} files have been deleted`,
                success: true
            })

        })

        app.post("/register", async (req, res, next) => {
            const user = await Users.findOne({ email: req.body.email.toLowerCase() });
            if (user) {
                next(new Error("Account already exists"));
            }

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const newUser = new Users({
                        createdOn: new Date(),
                        modifiedOn: new Date(),
                        group: req.body.group,
                        name: req.body.name,
                        userId: uuidv4(),
                        role: req.body.role,
                        email: req.body.email,
                        password: hash
                    });

                    try {
                        await newUser.save();
                        return res.json({
                            success: true
                        })
                    } catch (error) {
                        next(error);
                    }
                });
            });
        });

        app.get("/session-expired", passport.authenticate('jwt', { session: false }), async (_, res) => {
            res.json({
                success: true
            })
        });

        app.post("/login", async (req, res, next) => {

            try {
                const user = await Users.findOne({ email: req.body.username.toLowerCase() });
                const userMap = JSON.parse(JSON.stringify(user));
                const isPasswordTheSame = await bcrypt.compare(req.body.password, userMap.password);

                if (!isPasswordTheSame) {
                    throw new Error("Credentials don\'t match");
                }

                const { jwtToken } = config;

                if (!jwtToken) {
                    throw new Error("JWT ENV not set");
                }
                const token = jwt.sign(userMap, jwtToken, {
                    algorithm: "HS256",
                    expiresIn: "1d"

                });
                return res.json({
                    ...userMap,
                    success: true,
                    token: `Bearer ${token}`
                });
            } catch (e) {
                // TODO: Map Error Msgs to Error ID
                next(e);
            }
        });

        app.get("/reset-password", () => {
            // Should be a seperate package
        });

        app.get("/roles", passport.authenticate('jwt', { session: false }), (_, res, next) => {
            Roles.find((error, roles) => {
                if (error) {
                    next(error);
                }
                res.json({ roles: JSON.parse(JSON.stringify(roles)) });
            })
        });
        app.get("/users", passport.authenticate('jwt', { session: false }), (_, res, next) => {
            Users.find((error, users) => {
                if (error) {
                    next(error);
                }
                res.json({ users: JSON.parse(JSON.stringify(users)) });
            })
        });
        app.get("/groups/:id", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            const filter = {
                groupId: {
                    $in: [Number(req.params.id)]
                }
            };

            Groups.find(filter, (error, groups) => {
                if (error) {
                    next(error);
                }
                res.json({
                    groups: JSON.parse(JSON.stringify(groups))
                });
            });
        });
        app.get(["/properties", "/properties/:gid/:pid"], passport.authenticate('jwt', { session: false }), (req, res, next) => {            
            const filter = {
                groupId: {
                    $in: [Number(req.params.id)]
                },
                propertyId: {
                    $in: [Number(req.params.pid)]
                }
            };

            Properties.find(filter, (error, properties) => {
                if (error) {
                    next(error);
                }

                res.json({
                    properties: JSON.parse(JSON.stringify(properties))
                });
            });
        });
    })
}