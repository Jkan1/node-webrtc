import express from "express";
import socketIO from "socket.io";
import { createServer } from "http";

export class Server {
    httpServer;
    app;
    io;

    DEFAULT_PORT = 5000;

    constructor() {
        this.initialize();

        this.handleRoutes();
        this.handleSocketConnection();
    }

    initialize() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
    }

    handleRoutes() {
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }

    handleSocketConnection() {
        this.io.on("connection", socket => {
            console.log("Socket connected.");
        });
    }

    listen(callback) {
        this.httpServer.listen(this.DEFAULT_PORT, () =>
            callback(this.DEFAULT_PORT)
        );
    }
}