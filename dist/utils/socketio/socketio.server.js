"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOServer = exports.connectedSockets = void 0;
const socket_io_1 = require("socket.io");
const decodeToken_1 = require("../decodeToken");
const socketio_service_1 = require("./socketio.service");
exports.connectedSockets = new Map();
// ======================= socketIOServer =======================
const socketIOServer = (httpServer) => {
    const chatSocketServices = new socketio_service_1.SocketioServices();
    const ioServer = new socket_io_1.Server(httpServer, { cors: { origin: "*" } }); //* ioServer *//
    ioServer.use(async (socket, next) => {
        //* ioServer.use() *//
        authMiddleWare(socket, next);
    });
    ioServer.on("connection", (socket) => {
        //* ioServer.on("connection") *//
        connect(socket);
        chatSocketServices.sayHi(socket);
        chatSocketServices.sendMessage(socket);
        chatSocketServices.sendGroupMessage(socket);
        chatSocketServices.joinRoom(socket);
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
