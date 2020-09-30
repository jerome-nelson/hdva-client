import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { mongoInstance } from "./services/mongoose";
import { passport, passportStrategy } from "./services/passport";
import { uploadFilesMiddleware } from "./services/multer";
import { server } from "./services/api";
import { config } from "./services/config";
import { models } from "./mongo/schema";

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
            console.log(err);
            throw new Error(err);
        }
        data.roles = JSON.parse(JSON.stringify(roles));
    })

    await connection.users.find((err, users) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
        data.users = JSON.parse(JSON.stringify(users));
    })

    await connection.properties.find((err, properties) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
        data.properties = JSON.parse(JSON.stringify(properties));
    });

    await connection.groups.find((err, groups) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
        data.groups = JSON.parse(JSON.stringify(groups));
    });

    await connection.uploads.find((err, uploads) => {
        if (err) {
            console.log(err);
            throw new Error(err);
        }
        data.uploads = JSON.parse(JSON.stringify(uploads));
    });

    return data;
}

export async function start() {
    const conn = await mongoInstance();
    const data = await getData(conn);

    // Requires x-form-data-urlencoded
    await passportStrategy(async (user, pass, done) => {
        const User = models(conn).users;

        await User.findOne({ email: user }, async function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'USer not found' });
            }
            const userMap = JSON.parse(JSON.stringify(user));
            const matched = await bcrypt.compare(pass, userMap.password);
            if (!matched) {
                return done(null, false, { message: 'Credentials don\'t match' });
            }
            return done(null, userMap);
        });
    })

    server(app => {
        app.post("/upload", async (req, res) => {
            try {
                await uploadFilesMiddleware(req, res);
                if (!req.body.pid) {
                    return res.send(`Property ID must be provided`);
                }
                if (req.file == undefined) {
                  return res.send(`You must select a file.`);
                }
            
                return res.send(`File has been uploaded.`);
              } catch (error) {
                console.log(error);
                return res.send(`Error when trying upload image: ${error}`);
              }
        });
        app.post("/login", (req, res, next) => {
            passport.authenticate('local', { session: false }, function (err, user, info) {
                if (err || !user) {
                    return res.status(400).json({
                        message: info.message,
                        error: err,
                        user: user
                    });
                }
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    const token = jwt.sign(user, config.jwtToken);
                    return res.json({ user, token });
                })
            })(req, res, next)
        });

        app.get("/roles", (_, res) => {
            res.send(data.roles);
        });
        app.get("/users", (_, res) => {
            res.send(data.users);
        });
        app.get("/groups/:id", (req, res) => {
            const result = !req.params.id ? data.groups : data.groups.filter((elem: any) => elem.groupId === req.params.id);
            res.send(result)
        });
        app.get(["/properties", "/properties/:gid"], (req, res) => {
            const result = !req.params.gid  ? data.properties : data.properties.filter((elem: any) => elem.groupId === Number(req.params.gid));
            res.send(result)
        });
        app.get("/data/:gid/:pid", (req, res) => {
            const result = data.uploads.filter((elem: any) => elem.groupId === Number(req.params.gid) && elem.propertyId === Number(req.params.pid));
            res.send(result)
        });
    })
}