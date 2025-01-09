import { ObjectId } from "mongodb";
import { ICinema } from "../interfaces/cinema.ts";
import Cinema from "../models/cinema.ts";
import Movie from "../models/movie.ts";

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
        showTimes: [ShowTime]
    }

    input CinemaInput {
      name: String!
      address: String!
      location: LocationInput!
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
    getNearbyCinemas(userLocation: LocationInput!, maxDistance: Float): [Cinema]
  }

  type Mutation {
    createCinema(input: CinemaInput!): Cinema
    updateCinema(_id: ID!, input: CinemaInput!): Cinema
    deleteCinema(_id: ID!): Cinema
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
        const cinemaId = args._id;
        const cinema = await Cinema.findById(cinemaId);
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
      let cinemas = await Cinema.findNearby(userLocation, maxDistance);
      console.log(cinemas, "cinemas di getNearbyCinemas");

      return cinemas;
    },
  },

  Mutation: {
    createCinema: async (
      _: unknown,
      args: { input: ICinema }
    ): Promise<ICinema> => {
      const cinema = await Cinema.create(args.input);
      return cinema;
    },
    updateCinema: async (
      _: unknown,
      args: { _id: string; input: ICinema }
    ): Promise<ICinema> => {
      const cinema = await Cinema.update(args._id, args.input);
      return cinema;
    },
    deleteCinema: async (
      _: unknown,
      args: { _id: string }
    ): Promise<ICinema> => {
      const cinema = await Cinema.delete(args._id);
      return cinema;
    },
  },
};
