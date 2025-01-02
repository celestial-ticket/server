import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "./schema/userSchema.ts";
import { cinemaResolvers, cinemaTypeDefs } from './schema/cinemaSchema.ts';
import { studioTypeDefs } from './schema/studioSchema.ts';

const server = new ApolloServer({
  typeDefs: [userTypeDefs, cinemaTypeDefs, studioTypeDefs],
  resolvers: [userResolvers, cinemaResolvers],
});

startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
}).then((result) => {
  console.log(`🚀  Server ready at: ${result.url}`);
});
