const express = require("express");
const socketIO = require("socket.io");
const { createServer } = require("http");
const path = require("path");

module.exports = class Server {
    httpServer;
    app;
    io;

    DEFAULT_PORT = 3000;
    activeSockets = [];

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);

        this.configureApp();
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

            const existingSocket = this.activeSockets.find(
                existingSocket => existingSocket === socket.id
            );

            if (!existingSocket) {
                this.activeSockets.push(socket.id);

                socket.emit("update-user-list", {
                    users: this.activeSockets.filter(
                        existingSocket => existingSocket !== socket.id
                    )
                });

                socket.broadcast.emit("update-user-list", {
                    users: [socket.id]
                });
            }
            socket.on("disconnect", () => {
                this.activeSockets = this.activeSockets.filter(
                    existingSocket => existingSocket !== socket.id
                );
                socket.broadcast.emit("remove-user", {
                    socketId: socket.id
                });
            });
            socket.on("call-user", data => {
                socket.to(data.to).emit("call-made", {
                    offer: data.offer,
                    socket: socket.id
                });
            });
            socket.on("make-answer", data => {
                socket.to(data.to).emit("answer-made", {
                    socket: socket.id,
                    answer: data.answer
                });
            });
        });
    }

    listen(callback) {
        this.httpServer.listen(this.DEFAULT_PORT, () =>
            callback(this.DEFAULT_PORT)
        );
    }

    configureApp() {
        this.app.use(express.static(path.join(__dirname, "../client")));
    }

}
