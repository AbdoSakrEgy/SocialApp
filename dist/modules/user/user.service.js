"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_validation_1 = require("./user.validation");
class UserServices {
    constructor() { }
    async signUp(req, res, next) {
        const { name, email, password } = req.body;
        const result = await user_validation_1.signupSchema.safeParseAsync(req.body);
        if (!result.success) {
            return res
                .status(400)
                .json({ validationError: JSON.parse(result.error.message) });
        }
        return res.status(201).json({ message: "Done", result });
    }
    login(req, res, next) {
        return res.status(201).json({ message: "Done" });
    }
    getUser(req, res, next) {
        return res.status(201).json({ message: "Done" });
    }
}
exports.UserServices = UserServices;
