import express from "express";

function server() {
    const app = express();
    app.get("/roles", () => {});
    app.get("/users", () => {});
    app.get("/group/data", () => {});
}

export server;