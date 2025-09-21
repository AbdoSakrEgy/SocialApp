"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const Errors_1 = require("../../utils/Errors");
const db_services_1 = require("../../DB/db.services");
class UserServices {
    userModel = new db_services_1.DBServices(user_model_1.UserModel);
    constructor() { }
    // register
    register = async (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        // step: check user existance
        const isUserExist = await this.userModel.findOne({ filter: { email } });
        console.log(isUserExist);
        if (isUserExist) {
            throw new Errors_1.NotValidEmail("User already exist");
        }
        // step: create new user
        const user = await this.userModel.create({
            data: { firstName, lastName, email, password },
        });
        if (!user) {
            throw new Errors_1.ApplicationExpection("Creation failed", 500);
        }
        return res.status(201).json({ message: "User created successfully" });
    };
    // login
    async login(req, res, next) {
        return res.status(201).json({ message: "Done" });
    }
    // getUser
    async getUser(req, res, next) {
        return res.status(201).json({ message: "Done" });
    }
}
exports.UserServices = UserServices;
