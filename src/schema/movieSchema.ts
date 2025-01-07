import { IMovie } from "../interfaces/movie.ts";
import Movie from "../models/movie.ts";

export const movieTypeDefs = `#graphql
  type Movie {
    _id: ID!
    title: String!
    synopsis: String!
    genre: String!
    duration: String!
    thumbnail: String!
    cast: [String]!
    ageRating: String
    movieStatus: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    movies: [Movie]
    movie(_id: String!): Movie
    nowShowing: [Movie]
    upcoming: [Movie]
  }
`;

export const movieResolvers = {
  Query: {
    movies: async (): Promise<IMovie[]> => {
      return await Movie.findAll();
    },
    movie: async (_: unknown, args: { _id: string }): Promise<IMovie> => {
      const { _id: id } = args;
      console.log("🚀 ~ movie: ~ id:", id);
      const movie = await Movie.findById(id);
      if (!movie) throw new Error("Movie not found");
      return movie;
    },

    //find movie by movie status "now showing"
    nowShowing: async (): Promise<IMovie[]> => {
      return await Movie.findByStatus("Now Showing");
    },

    upcoming: async (): Promise<IMovie[]> => {
      return await Movie.findByStatus("Upcoming");
    },
  },
};
