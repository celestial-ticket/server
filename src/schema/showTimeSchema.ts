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
    seatList: [Seat]
    studioId: ID!
    movieId: ID!
    cinemaId: ID!
    }

    type Seat {
        seat: String
        status: String
    }   

    #  Query Get Show Time (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
    type Query {
        getShowTimes(movieId: ID!, date: String!): [ShowTime]
    }
`;

export const showTimeResolvers = {
  Query: {
    getShowTimes: async (_: unknown, args: { movieId: string, date: string}) => {
      const movieId = new ObjectId(args.movieId); 
      const showTimes = await ShowTime.findAll(movieId, args.date);
      console.log(showTimes, "????, showtime schema");
      return showTimes;
    },
  },
};
