import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  console.log("load env db.ts");
  dotenv.config();
}
export const dynamic = "force-dynamic";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
console.log("🚀 ~ JWT_SECRET:", JWT_SECRET);

const signToken = (data: { _id: string; email: string }) => {
  return jwt.sign(data, JWT_SECRET);
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export { signToken, verifyToken };
