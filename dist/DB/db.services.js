"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBServices = void 0;
class DBServices {
    model;
    constructor(model) {
        this.model = model;
    }
    create = async ({ data, }) => {
        const doc = await this.model.create(data);
        return doc;
    };
    findOne = async ({ filter, projection, options, }) => {
        const doc = await this.model.findOne(filter, projection, options);
        return doc;
    };
}
exports.DBServices = DBServices;
