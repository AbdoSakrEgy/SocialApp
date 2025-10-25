import { NextFunction, Request, Response } from "express";
import { UserRepo } from "../user/user.repo";
import { ApplicationExpection } from "../../utils/Errors";
import { ChatRepo } from "./chat.repo";
import { successHandler } from "../../utils/successHandler";
import { createChatGroupDTO, getChatDTO } from "./chat.dto";

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
    const chatId = req.params.chatId as unknown as getChatDTO;
    // step: check chat existence
    const chat = await this.chatRepo.findOne({ filter: { _id: chatId } });
    if (!chat) {
      throw new ApplicationExpection("Chat not found", 404);
    }
    return successHandler({ res, result: { chat } });
  };
  // ============================ createChat ============================
  createChat = async (
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
    if (chat) {
      return successHandler({ res, result: { chat } });
    }
    // step: create new chat
    const newChat = await this.chatRepo.create({
      data: {
        participants: [user._id, userId],
        createdBy: user._id,
      },
    });
    return successHandler({ res, result: { chat: newChat } });
  };
  // ============================ createChatGroup ============================
  createChatGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { groupName, participants }: createChatGroupDTO = req.body;
    // step: check participants existence
    const participantsInDB = await this.userRepo.find({
      filter: { _id: { $in: participants } },
    });
    if (participants.length != participantsInDB?.length) {
      throw new ApplicationExpection("Some users not found", 404);
    }
    // step: add group owner to participants
    if (!participants.includes(user._id.toString())) {
      participants.push(user._id);
    }
    // step: check group existence
    const group = await this.chatRepo.findOne({
      filter: { groupName, createdBy: user._id },
    });
    if (group) {
      return successHandler({
        res,
        message: "Group created successfully",
        result: { group },
      });
    }
    // step: creat new group
    const newGroup = await this.chatRepo.create({
      data: {
        participants,
        groupName,
        createdBy: user._id,
      },
    });
    return successHandler({
      res,
      message: "Group created successfully",
      result: { group: newGroup },
    });
  };
}
