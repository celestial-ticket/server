import { ObjectId } from "mongodb";
import ShowTime from "../models/showtime.ts";
import Cinema from "../models/cinema.ts";

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
      getShowTimes(movieId: ID!, date: String!, userLocation: LocationInput!): [CinemaWithShowTime]
        
    }

    input LocationInput {
    type: String!
    coordinates: [Float!]!
  }
`;

export const showTimeResolvers = {
  Query: {
    getShowTimes: async (
      _: unknown,
      args: { movieId: string; date: string, userLocation: { type: string; coordinates: [number, number] } }
    ) => {
      const movieId = new ObjectId(args.movieId);
      const { userLocation} = args;
      const nearbyCinemas = await Cinema.findNearby(userLocation, 10 * 1000);
      console.log(nearbyCinemas, "===");
      const showTimes = await ShowTime.findAllByMovieAndCinemas(movieId, args.date, nearbyCinemas.map(cinema => cinema._id));
      const cinemaWithShowTimes = nearbyCinemas.map(cinema => ({
        _id: cinema._id,
        cinema,
        showTimes: showTimes.filter(showTime => showTime.cinemaId.equals(cinema._id))
      }));
      return cinemaWithShowTimes;
    },


  },
};
