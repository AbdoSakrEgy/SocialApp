import {
  HydratedDocument,
  Model,
  FilterQuery,
  ProjectionFields,
  QueryOptions,
} from "mongoose";
import { IUser } from "../modules/user/user.model";

export class DBServices<T> {
  constructor(private model: Model<T>) {}

  create = async ({
    data,
  }: {
    data: Partial<T>;
  }): Promise<HydratedDocument<T>> => {
    const doc = await this.model.create(data);
    return doc;
  };

  findOne = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionFields<T>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<T> | null> => {
    const doc = await this.model.findOne(filter, projection, options);
    return doc;
  };
}
