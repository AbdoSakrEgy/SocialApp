import { HydratedDocument } from "mongoose";
import { IUser } from "../../user/user.model";
import { PostAvilableForEnum } from "../../../types/post.module.types";

export const avilabiltyConditation = (user: HydratedDocument<IUser>) => {
  return [
    {
      avilableFor: PostAvilableForEnum.PUBLIC,
    },
    {
      avilableFor: PostAvilableForEnum.PRIVATE,
      createdBy: user._id,
    },
    {
      avilableFor: PostAvilableForEnum.PRIVATE,
      tags: { $in: user._id },
    },
    {
      avilableFor: PostAvilableForEnum.FRIENDS,
      createdBy: { $in: [...user.friends, user._id] },
    },
  ];
};
