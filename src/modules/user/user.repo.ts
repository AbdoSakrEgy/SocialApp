import {
  HydratedDocument,
  Model,
  ProjectionFields,
  QueryOptions,
} from "mongoose";
import { DBRepo } from "../../DB/repos/db.repo";
import { IUser, UserModel } from "./user.model";

export class UserRepo extends DBRepo<IUser> {
  constructor(protected override readonly model: Model<IUser> = UserModel) {
    super(model);
  }

  findByEmail = async ({
    email,
    projection,
    options,
  }: {
    email: string;
    projection?: ProjectionFields<IUser>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<IUser> | null> => {
    const doc = await this.model.findOne({ email }, projection, options);
    return doc;
  };
}
