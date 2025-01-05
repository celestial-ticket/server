import { ICinema } from "../interfaces/cinema.ts";
import Cinema from "../models/cinema.ts";

export const cinemaTypeDefs = `#graphql
    # Type of data we have
    type Cinema{
        _id: ID!
        name: String!
        address: String!
    }

    type CinemaDetailResponse{
      cinema: Cinema
    }

     # type query
     type Query {
        cinemas: [Cinema] #get cinema
        cinema(_id: ID!): CinemaDetailResponse #get cinema by id
    }
`;

export const cinemaResolvers = {
  Query: {
    cinemas: async (): Promise<ICinema[]> => {
      return await Cinema.findAll();
    },

    cinema: async (
      _: unknown,
      args: { _id: string }
    ): Promise<{ cinema: ICinema }> => {
      try {
        const cinema = await Cinema.findOne(args._id);
        if (!cinema) {
          throw new Error("Cinema not found");
        }
        return { cinema };
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error("Failed to fetch cinema");
      }
    },
  },

  
};
