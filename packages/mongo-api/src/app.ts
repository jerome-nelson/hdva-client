import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { passport, passportStrategy } from "./services/passport";
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

async function getData(conn: mongoose.Connection) {
    const data: Record<string, any> = {
        roles: [],
        users: [],
        properties: [],
        groups: [],
        uploads: []
    }

    const connection = models(conn);
    await connection.roles.find((err, roles) => {
        if (err) {
            // Can this be caught by middleware?
            throw new Error(err);
        }
        data.roles = JSON.parse(JSON.stringify(roles));
    })

    await connection.users.find((err, users) => {
        if (err) {
            throw new Error(err);
        }
        data.users = JSON.parse(JSON.stringify(users));
    })

    await connection.properties.find((err, properties) => {
        if (err) {
            throw new Error(err);
        }
        data.properties = JSON.parse(JSON.stringify(properties));
    });

    await connection.groups.find((err, groups) => {
        if (err) {
            throw new Error(err);
        }
        data.groups = JSON.parse(JSON.stringify(groups));
    });

    await connection.uploads.find((err, uploads) => {
        if (err) {
            throw new Error(err);
        }
        data.uploads = JSON.parse(JSON.stringify(uploads));
    });

    return data;
}

export async function start() {
    const conn = await mongoInstance();
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "files"
    })
    const data = await getData(conn);
    const User = models(conn).users;
    const Properties = models(conn).properties;

    passportStrategy(conn);

    // TODO: Add User to Passport Typing withj correct schema
    server(app => {

        app.get("/image/:filename", async (req, res, next) => {
            if (!req.params.filename) {
                next(new Error("filename must be specified"));
            }

            const fileStream = gfs.openDownloadStreamByName(req.params.filename);
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
            gfs.find({ "metadata.pid": req.params.pid, ...type }).toArray((error: Error, files: any[]) => {
                if (error) {
                    next(error);
                }

                res.json({
                    files: files.map(elem => elem.filename),
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
                gfs.delete(id, (error, result) => {
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
            // TODO: Type User Object and fix roles
                if (req.user && ![1, 2, 4].includes((req.user as any).role)) {
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
                const getProperties = await Properties.find({ propertyId: { $in: req.body.ids }});
                const existingProperties: string[] = JSON.parse(JSON.stringify(getProperties))
                    .map(({ propertyId }: { propertyId: string }) => propertyId);
                    
                if (existingProperties.length <= 0) {
                    next(new Error("No properties to delete"));
                }

                for (const pid of existingProperties) {
                    gfs.find({ "metadata.pid": String(pid) }).toArray((error: Error, files: any[]) => {
                        if (error) {
                           fileErrors.push(error.message);
                        }
                        for (const file of files) {
                            gfs.delete(mongoose.Types.ObjectId(file._id), (error) => {
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
            const user = await User.findOne({ email: req.body.email.toLowerCase() });
            if (user) {
                next(new Error("Account already exists"));
            }

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, async function (err, hash) {
                    const newUser = new User({
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
                const user = await User.findOne({ email: req.body.username.toLowerCase() });
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

        app.get("/roles", passport.authenticate('jwt', { session: false }), (_, res) => {
            res.send(data.roles);
        });
        app.get("/users", passport.authenticate('jwt', { session: false }), (_, res) => {
            res.send(data.users);
        });
        app.get("/groups/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
            const result = !req.params.id ? data.groups : data.groups.filter((elem: any) => elem.groupId === req.params.id);
            res.send(result)
        });
        app.get(["/properties", "/properties/:gid/:pid"], passport.authenticate('jwt', { session: false }), (req, res) => {
            let result = !req.params.gid || Number(req.params.gid) === SUPER_ROLE ? data.properties : data.properties.filter((elem: any) => elem.groupId === Number(req.params.gid));
            result = !req.params.pid ? result : result.filter((elem: any) => elem.propertyId === Number(req.params.pid));
            res.send(result);
        });
    })
}