"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initalize = exports.connectedSockets = void 0;
const socket_io_1 = require("socket.io");
const decodeToken_1 = require("../../utils/decodeToken");
const chat_gateway_1 = require("../chat/chat.gateway");
exports.connectedSockets = new Map();
// ======================= initalize =======================
const initalize = (httpServer) => {
    const chatGateway = new chat_gateway_1.ChatGateway();
    const ioServer = new socket_io_1.Server(httpServer, { cors: { origin: "*" } }); //* ioServer *//
    ioServer.use(async (socket, next) => {
        authMiddleWare(socket, next);
    });
    ioServer.on("connection", (socket) => {
        connect(socket);
        chatGateway.register(socket);
        disconnect(socket);
    });
};
exports.initalize = initalize;
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
    socket.on("disconnect", () => {
        const userSockets = exports.connectedSockets.get(socket.user?._id.toString()) || [];
        let newUserSockets = userSockets.filter((item) => item != socket.id);
        exports.connectedSockets.set(socket.user?._id.toString(), newUserSockets);
    });
}
