import { IMovie } from "../interfaces/movie.ts";
import Movie from "../models/movie.ts";

export const movieTypeDefs =`#graphql
  type Movie {
    _id: ID!
    title: String!
    synopsis: String!
    genre: String!
    duration: String!
    thumbnail: String!
    cast: [String]!
    ageRating: String!
  }

  type Query {
    movies: [Movie]
  }
`;

export const movieResolvers = {
  Query: {
    movies: async (): Promise<IMovie[]> => {
      return await Movie.findAll();
    },
  },
};
