"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOServer = exports.connectedSockets = void 0;
const socket_io_1 = require("socket.io");
const decodeToken_1 = require("../decodeToken");
const chat_socket_service_1 = require("../../modules/chat/chat.socket.service");
exports.connectedSockets = new Map();
// ======================= socketIOServer =======================
const socketIOServer = (httpServer) => {
    const chatSocketService = new chat_socket_service_1.ChatSocketServices();
    const ioServer = new socket_io_1.Server(httpServer, { cors: { origin: "*" } }); //* ioServer *//
    ioServer.use(async (socket, next) => {
        //* ioServer.use() *//
        authMiddleWare(socket, next);
    });
    ioServer.on("connection", (socket) => {
        //* ioServer.on("connection") *//
        connect(socket);
        chatSocketService.sayHi(socket);
        chatSocketService.sendMessage(socket);
        disconnect(socket);
    });
};
exports.socketIOServer = socketIOServer;
// ======================= authMiddleWare =======================
async function authMiddleWare(socket, next) {
    try {
        const { user, payload } = await (0, decodeToken_1.decodeToken)({
            authorization: socket.handshake.auth.accessToken,
        });
        socket.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
}
// ======================= connect =======================
function connect(socket) {
    const userSockets = exports.connectedSockets.get(socket.user?._id.toString()) || [];
    userSockets?.push(socket.id);
    exports.connectedSockets.set(socket.user?._id.toString(), userSockets);
}
// ======================= disconnect =======================
function disconnect(socket) {
    socket.on("disconnect", (arg) => {
        const userSockets = exports.connectedSockets.get(socket.user?._id.toString()) || [];
        let newUserSockets = userSockets.filter((item) => item != socket.id);
        exports.connectedSockets.set(socket.user?._id.toString(), newUserSockets);
    });
}
