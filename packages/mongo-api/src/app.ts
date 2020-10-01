import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { passport, passportStrategy } from "./services/passport";
import { mongoInstance } from "./services/mongoose";
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
    passportStrategy(conn);

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
                return res.status(400).json({
                    message: `Error when trying upload image: ${error.message}`,
                    error
                });
            }
        });
        app.post("/login", async (req, res, next) => {
            const User = models(conn).users;

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
                    token: `Bearer ${token}` 
                });
            } catch (e) {
                // TODO: Map Error Msgs to Error ID
                return res.status(400).json({
                    message: `Error Occurred - ${e.message}`,
                    error: e
                });
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
        app.get(["/properties", "/properties/:gid"], passport.authenticate('jwt', { session: false }), (req, res) => {
            const result = !req.params.gid ? data.properties : data.properties.filter((elem: any) => elem.groupId === Number(req.params.gid));
            res.send(result)
        });
        app.get("/data/:gid/:pid", passport.authenticate('jwt', { session: false }), (req, res) => {
            const result = data.uploads.filter((elem: any) => elem.groupId === Number(req.params.gid) && elem.propertyId === Number(req.params.pid));
            res.send(result)
        });
    })
}