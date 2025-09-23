import { Secret, sign, SignOptions } from "jsonwebtoken";

export const createJwt = (
  payload: string | object,
  privateKey: Secret,
  options?: SignOptions
) => {
  const token = sign(payload, privateKey, options);
  return token;
};
