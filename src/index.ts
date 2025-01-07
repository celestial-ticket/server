console.log("index");
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  console.log("Loading .env file");
  dotenv.config();
}

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schema/userSchema.ts";
import { cinemaResolvers, cinemaTypeDefs } from "./schema/cinemaSchema.ts";
import { verifyToken } from "./helpers/jwt.ts";
import { movieResolvers, movieTypeDefs } from "./schema/movieSchema.ts";
import { orderResolvers, orderTypeDefs } from "./schema/orderSchema.ts";
import User from "./models/user.ts";
import { IUser } from "./interfaces/user.ts";
import { WithId } from "mongodb";
import {
  showTimeResolvers,
  showTimeTypeDefs,
} from "./schema/showTimeSchema.ts";
import { studioTypeDefs } from "./schema/studioSchema.ts";
import { midtransResolvers, midtransTypeDefs } from "./schema/midtrans.ts";

interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  res: unknown;
}
export async function createApolloServer({ port }: { port: number }) {
  console.log("Creating Apollo Server");
  console.log(
    "MONGODB_URI inside createApolloServer:",
    process.env.MONGODB_URI
  );

  const server = new ApolloServer({
    typeDefs: [
      userTypeDefs,
      cinemaTypeDefs,
      movieTypeDefs,
      midtransTypeDefs,
      showTimeTypeDefs,
      studioTypeDefs,
      orderTypeDefs,
    ],
    resolvers: [
      userResolvers,
      cinemaResolvers,
      movieResolvers,
      midtransResolvers,
      showTimeResolvers,
      orderResolvers,
    ],
  });

  const { url } = await startStandaloneServer<any>(server, {
    listen: {
      port,
    },
    context: async ({ req, res }: Context) => {
      //async function authorization
      async function auth(): Promise<WithId<IUser>> {
        const { authorization } = req.headers;
        // console.log(req.headers, "<<<");
        if (!authorization) throw new Error("Invalid Token");

        const [type, token] = authorization.split(" ");
        if (type !== "Bearer" || !token) throw new Error("Invalid Token");

        const payload = verifyToken(token);

        if (typeof payload !== "string" && payload._id) {
          const user = await User.findOne(payload._id as string);
          return user;
        }
        throw new Error("Invalid Token");
      }
      return { auth };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
  return { server, url };
}

if (process.env.NODE_ENV !== "test") {
  createApolloServer({ port: 4000 });
}
