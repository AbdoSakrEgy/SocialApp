"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepo = void 0;
class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    findOne = async ({ filter, projection, options, }) => {
        // step: check if lean true, it will prevent virtuals to appear in ruselt
        if (options?.lean) {
            await this.model.findOne(filter, projection, options).lean(true);
            return await this.model.findOne(filter, projection, options).exec();
        }
        const doc = await this.model.findOne(filter, projection, options);
        return doc;
    };
    find = async ({ filter, projection, options, }) => {
        // step: check if lean true, it will prevent virtuals to appear in ruselt
        if (options?.lean) {
            await this.model.find(filter, projection, options).lean(true);
            return await this.model.find(filter, projection, options).exec();
        }
        const doc = await this.model.find(filter, projection, options);
        return doc;
    };
    create = async ({ data, }) => {
        const doc = await this.model.create(data);
        return doc;
    };
    findOneAndUpdate = async ({ filter, data, options = { new: true }, }) => {
        // step: check if lean true, it will prevent virtuals to appear in ruselt
        if (options?.lean) {
            await this.model.findOneAndUpdate(filter, data, options).lean(true);
            return await this.model.findOneAndUpdate(filter, data, options).exec();
        }
        const doc = await this.model.findOneAndUpdate(filter, data, options);
        return doc;
    };
    findOneAndDelete = async ({ filter, options, }) => {
        // step: check if lean true, it will prevent virtuals to appear in ruselt
        if (options?.lean) {
            await this.model.findOneAndDelete(filter, options).lean(true);
            return await this.model.findOneAndDelete(filter, options).exec();
        }
        const doc = await this.model.findOneAndDelete(filter, options);
        return doc;
    };
}
exports.DBRepo = DBRepo;
