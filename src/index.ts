import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const server = new ApolloServer({
  typeDefs: [],
  resolvers: [],
});

startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
}).then((result) => {
  console.log(`🚀  Server ready at: ${result.url}`);
});
