import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";

const userServices = new UserServices();

router.get("/say-hello", userServices.sayHello);
router.get("/get-user", userServices.getUser);

export default router;
