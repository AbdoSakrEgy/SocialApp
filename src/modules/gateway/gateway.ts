import { HydratedDocument } from "mongoose";
import { Server, Socket } from "socket.io";
import { IUser } from "../user/user.model";
import { Server as httpServer } from "node:http";
import { decodeToken } from "../../utils/decodeToken";
import { ChatGateway } from "../chat/chat.gateway";

export interface AuthSocket extends Socket {
  user?: HydratedDocument<IUser>;
}
export let connectedSockets = new Map<string, string[]>();

// ======================= initalize =======================
export const initalize = (httpServer: httpServer) => {
  const chatGateway = new ChatGateway();
  const ioServer = new Server(httpServer, { cors: { origin: "*" } }); //* ioServer *//
  ioServer.use(async (socket: AuthSocket, next) => { //* ioServer.use() *//
    authMiddleWare(socket, next);
  });
  ioServer.on("connection", (socket: AuthSocket) => { //* ioServer.on("connection") *//
    connect(socket);
    chatGateway.register(socket);
    disconnect(socket);
  });
};

// ======================= authMiddleWare =======================
async function authMiddleWare(socket: AuthSocket, next: any) {
  try {
    const { user, payload } = await decodeToken({
      authorization: socket.handshake.auth.accessToken,
    });
    socket.user = user;
    next();
  } catch (err) {
    next(err as Error);
  }
}
// ======================= connect =======================
function connect(socket: AuthSocket) {
  const userSockets =
    connectedSockets.get(socket.user?._id.toString() as string) || [];
  userSockets?.push(socket.id);
  connectedSockets.set(socket.user?._id.toString() as string, userSockets);
}
// ======================= disconnect =======================
function disconnect(socket: AuthSocket) {
  socket.on("disconnect", () => {
    const userSockets =
      connectedSockets.get(socket.user?._id.toString() as string) || [];
    let newUserSockets = userSockets.filter((item) => item != socket.id);
    connectedSockets.set(socket.user?._id.toString() as string, newUserSockets);
  });
}
