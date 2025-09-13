"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config({
    path: path_1.default.resolve("./src/.env"),
});
const routes_1 = __importDefault(require("./routes"));
const db_connection_1 = require("./DB/db.connection");
const bootstrap = async () => {
    await (0, db_connection_1.connectDB)();
    app.use(express_1.default.json());
    app.use("/api/v1", routes_1.default);
    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json({
            errMsg: err.message,
            status: err.statusCode || 500,
            stack: err.stack,
        });
    });
    app.listen(process.env.PORT, () => {
        console.log("Backend server is running on port", process.env.PORT);
        console.log("=========================================");
    });
};
exports.default = bootstrap;
