"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
class UserServices {
    constructor() { }
    sayHello(req, res, next) {
        return res.json({ msg: "Hello" });
    }
    getUser(req, res, next) {
        return res.json({ name: "abdo", age: 24 });
    }
}
exports.UserServices = UserServices;
