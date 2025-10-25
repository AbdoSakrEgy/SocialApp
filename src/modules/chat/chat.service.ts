import { NextFunction, Request, Response } from "express";
import { UserRepo } from "../user/user.repo";
import { ApplicationExpection } from "../../utils/Errors";
import { ChatRepo } from "./chat.repo";
import { successHandler } from "../../utils/successHandler";

export interface IChatServices {}

export class ChatServices implements IChatServices {
  private userRepo = new UserRepo();
  private chatRepo = new ChatRepo();

  constructor() {}
  // ============================ getChat ============================
  getChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const userId = req.params.userId;
    // step: check users are friends
    const to = await this.userRepo.findOne({
      filter: { _id: userId, friends: { $in: [user._id] } },
    });
    if (!to) {
      throw new ApplicationExpection("User not found", 404);
    }
    // step: check chat existence
    const chat = await this.chatRepo.findOne({
      filter: {
        participants: {
          $all: [to._id, user._id],
        },
        group: { $exists: false },
      },
      options: { populate: "participants" },
    });
    if (!chat) {
      const newChat = await this.chatRepo.create({
        data: {
          participants: [user._id, userId],
          createdBy: user._id,
          message: [],
        },
      });
      return successHandler({ res, result: { newChat } });
    }
    return successHandler({ res, result: { chat } });
  };
}
