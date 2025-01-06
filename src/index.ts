import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schema/userSchema.ts";
import { cinemaResolvers, cinemaTypeDefs } from "./schema/cinemaSchema.ts";
import { verifyToken } from "./helpers/jwt.ts";
import { movieResolvers, movieTypeDefs } from "./schema/movieSchema.ts";
import User from "./models/user.ts";

interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  res: unknown;
}

const server = new ApolloServer({
  typeDefs: [userTypeDefs, cinemaTypeDefs, movieTypeDefs],
  resolvers: [userResolvers, cinemaResolvers, movieResolvers],
});

startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
  context: async ({ req, res }: Context) => {
    //async function authorization
    async function auth() {
      const { authorization } = req.headers;
      console.log(req.headers, "<<<");
      if (!authorization) throw new Error("Invalid Token");

      const [type, token] = authorization.split(" ");
      if (type !== "Bearer" || !token) throw new Error("Invalid Token");
    
      const payload = verifyToken(token);
      console.log(payload, "<<<");

      // const user = await User.findOne(payload._id)
      // return user
    }
    return { auth };
  },
}).then((result) => {
  console.log(`🚀  Server ready at: ${result.url}`);
});