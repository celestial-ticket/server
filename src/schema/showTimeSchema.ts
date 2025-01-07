import { ObjectId } from "mongodb";
import ShowTime from "../models/showtime.ts";

export const showTimeTypeDefs = `#graphql
    # Type of data we have
    type ShowTime {
      _id: ID!
      startTime: String
      endTime: String
      date: String
      price: Int
      seatList: [[String]]
      studioId: ID!
      movieId: ID!
      cinemaId: ID!
      
      cinema: Cinema
      movie: Movie
    }

    type CinemaWithShowTime {
      _id: ID!
      cinema: Cinema
      showTimes: [ShowTime]
    }
    #  Query Get Show Time (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
    type Query {
        getShowTimes(movieId: ID!, date: String!): [CinemaWithShowTime]
    }
`;

export const showTimeResolvers = {
  Query: {
    getShowTimes: async (
      _: unknown,
      args: { movieId: string; date: string }
    ) => {
      const movieId = new ObjectId(args.movieId);
      const showTimes = await ShowTime.findAll(movieId, args.date);
      return showTimes;
    },
  },
};
