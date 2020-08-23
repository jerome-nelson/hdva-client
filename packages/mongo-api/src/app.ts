import { mongoInstance } from "./services/mongoose";
import { server } from "./services/api";
import { models } from "./mongo/schema";
import mongoose from "mongoose";

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
    server(app => {
        app.post("/login", (req, res) => {
            
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