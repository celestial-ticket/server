import { ObjectId } from "mongodb";
import { ICinema } from "../interfaces/cinema.ts";
import Cinema from "../models/cinema.ts";

export const cinemaTypeDefs = `#graphql
    # Type of data we have
    type Cinema{
        _id: ID!
        name: String!
        address: String!
        location: Location!
        # studios: [Studio]
        createdAt: String
        updatedAt: String
    }

    type Location {
    type: String!
    coordinates: [Float!]!
  }

  input LocationInput {
    type: String!
    coordinates: [Float!]!
  }

  # type query
  type Query {
    cinemas: [Cinema] #get cinema
    cinema(_id: ID!): Cinema #get cinema by id
    getNearbyCinemas(userLocation: LocationInput!, maxDistance: Int): [Cinema]
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
    ): Promise<ICinema | null> => {
      try {
        console.log(args, "args di cinema");
        const cinemaId = new ObjectId(args._id);
        const cinema = await Cinema.findOne(cinemaId);
        console.log(cinema, "cinema di schema");
        return cinema;
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error("Failed to fetch cinema");
      }
    },

    getNearbyCinemas: async (
      _: unknown,
      args: {
        userLocation: { type: string; coordinates: [number, number] };
        maxDistance: number;
      }
    ): Promise<any[]> => {
      const { userLocation, maxDistance } = args;
      const cinemas = await Cinema.findNearby(userLocation, maxDistance);
      console.log(cinemas, "cinemas di getNearbyCinemas");

      return cinemas;
    },
  },
};
