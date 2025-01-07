import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { IShowTime } from "../interfaces/showTime.ts";

export default class ShowTime {
  static coll = db.collection<IShowTime>("showTimes");

  // Query Get Show Time (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
  static async findAll(movieId: ObjectId, date: string): Promise<IShowTime[]> {
    // Convert date to start and end of day
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    // Aggregate pipeline
    const pipeline = await this.coll
      .aggregate([
        {
          $match: {
            movieId: movieId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $lookup: {
            from: "cinemas",
            localField: "cinemaId",
            foreignField: "_id",
            as: "cinema",
          },
        },
        {
          $unwind: "$cinema",
        },
        {
          $group: {
            _id: "$cinemaId",
            showTimes: { $push: "$$ROOT" },
            cinema: { $addToSet: "$cinema" },
          },
        },
        {
          $unwind: "$cinema",
        },
      ])
      .toArray();

    return pipeline as IShowTime[];
  }

  static async findAllByMovieAndCinemas(
    movieId: ObjectId,
    date: string,
    cinemaIds: ObjectId[]
  ): Promise<IShowTime[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    return this.coll
      .find({
        movieId,
        cinemaId: { $in: cinemaIds },
        date: { $gte: startDate, $lt: endDate },
      })
      .toArray();
  }
}
