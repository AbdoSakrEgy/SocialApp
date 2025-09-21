import z from "zod";
import { registerSchema } from "./user.validation";

export type registerDTO = z.infer<typeof registerSchema>;
