import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { IShowTime } from "../interfaces/showTime.ts";

export default class ShowTime {
  static coll = db.collection<IShowTime>("showTimes");

  // Query Get Show Time (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
  static async findAll(movieId: ObjectId, date: string): Promise<IShowTime[]> {
    console.log(`Fetching show times for movieId: ${movieId}, date: ${date}`);

    // Convert date to start and end of day
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    console.log(movieId, startDate, endDate);

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

    console.log(`Fetched ${pipeline.length} showtimes.`);
    console.log(pipeline);

    return pipeline as IShowTime[];
  }
}
