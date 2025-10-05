import {
  HydratedDocument,
  Model,
  FilterQuery,
  ProjectionFields,
  QueryOptions,
  FlattenMaps,
  UpdateQuery,
} from "mongoose";

export class DBRepo<T> {
  constructor(protected model: Model<T>) {}
  // ============================ findOne ============================
  findOne = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionFields<T>;
    options?: QueryOptions;
  }): Promise<
    HydratedDocument<T> | null | FlattenMaps<HydratedDocument<T>>
  > => {
    // step: check if lean true, it will prevent virtuals to appear in ruselt
    if (options?.lean) {
      await this.model.findOne(filter, projection, options).lean(true);
      return await this.model.findOne(filter, projection, options).exec();
    }
    const doc = await this.model.findOne(filter, projection, options);
    return doc;
  };
  // ============================ find ============================
  find = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionFields<T>;
    options?: QueryOptions;
  }): Promise<
    HydratedDocument<T>[] | null | FlattenMaps<HydratedDocument<T>[]> | []
  > => {
    // step: check if lean true, it will prevent virtuals to appear in ruselt
    if (options?.lean) {
      await this.model.find(filter, projection, options).lean(true);
      return await this.model.find(filter, projection, options).exec();
    }
    const doc = await this.model.find(filter, projection, options);
    return doc;
  };
  // ============================ create ============================
  create = async ({
    data,
  }: {
    data: Partial<T>;
  }): Promise<HydratedDocument<T>> => {
    const doc = await this.model.create(data);
    return doc;
  };

  findOneAndUpdate = async ({
    filter,
    data,
    options = { new: true },
  }: {
    filter: FilterQuery<T>;
    data: UpdateQuery<T>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<T> | null> => {
    // step: check if lean true, it will prevent virtuals to appear in ruselt
    if (options?.lean) {
      await this.model.findOneAndUpdate(filter, data, options).lean(true);
      return await this.model.findOneAndUpdate(filter, data, options).exec();
    }
    const doc = await this.model.findOneAndUpdate(filter, data, options);
    return doc;
  };
  // ============================ findOneAndDelete ============================
  findOneAndDelete = async ({
    filter,
    options,
  }: {
    filter: FilterQuery<T>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<T> | null> => {
    // step: check if lean true, it will prevent virtuals to appear in ruselt
    if (options?.lean) {
      await this.model.findOneAndDelete(filter, options).lean(true);
      return await this.model.findOneAndDelete(filter, options).exec();
    }
    const doc = await this.model.findOneAndDelete(filter, options);
    return doc;
  };
}
