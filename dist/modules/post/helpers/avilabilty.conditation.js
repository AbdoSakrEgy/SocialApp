"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avilabiltyConditation = void 0;
const post_module_types_1 = require("../../../types/post.module.types");
const avilabiltyConditation = (user) => {
    return [
        {
            avilableFor: post_module_types_1.PostAvilableForEnum.PUBLIC,
        },
        {
            avilableFor: post_module_types_1.PostAvilableForEnum.PRIVATE,
            createdBy: user._id,
        },
        {
            avilableFor: post_module_types_1.PostAvilableForEnum.PRIVATE,
            tags: { $in: user._id },
        },
        {
            avilableFor: post_module_types_1.PostAvilableForEnum.FRIENDS,
            createdBy: { $in: [...user.friends, user._id] },
        },
    ];
};
exports.avilabiltyConditation = avilabiltyConditation;
