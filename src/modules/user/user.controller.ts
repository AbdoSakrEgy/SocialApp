import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";

const userServices = new UserServices();

// router.get("/user-profile");

export default router;
