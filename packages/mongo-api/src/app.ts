import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { mongoInstance } from "./services/mongoose";
import { passport, passportStrategy } from "./services/passport";
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
        await User.findOne({ email: user, password: pass }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            return done(null, JSON.parse(JSON.stringify(user)));
        });
    })

    server(app => {
        app.post("/login", (req, res, next) => {
            passport.authenticate('local', { session: false }, function (err, user, info) {
                if (err || !user) {
                    console.log(req);
                    console.log(res);
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
            const result = !req.params.gid ? data.properties : data.properties.filter((elem: any) => elem.groupId === Number(req.params.gid));
            res.send(result)
        });
        app.get("/data/:gid/:pid", (req, res) => {
            const result = data.uploads.filter((elem: any) => elem.groupId === Number(req.params.gid) && elem.propertyId === Number(req.params.pid));
            res.send(result)
        });
    })
}