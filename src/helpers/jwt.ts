
export const dynamic = 'force-dynamic'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

const signToken = (data: { _id: string; email: string }) => {
  return jwt.sign(data, JWT_SECRET);
};

const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};


export { signToken, verifyToken };
