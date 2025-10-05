import z from "zod";
import { updateBasicInfoSchema } from "./user.validation";

export type updateBasicInfoDTO = z.infer<typeof updateBasicInfoSchema>;
