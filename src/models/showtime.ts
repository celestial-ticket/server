import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { IShowTime } from "../interfaces/showTime.ts";

export default class ShowTime {
  static coll = db.collection<IShowTime>("showTimes");

  // Query Get Show Time (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
  static async findAll(movieId: ObjectId, date: string): Promise<IShowTime[]> {
    // (Aggregate), Match by FilmID, Date, Group By CinemaID, Lookup ke Cinema By CinemaID
    console.log(movieId, date, "????, showtime model 1");
    const pipeline = await this.coll
      .aggregate([
        {
            $match: {
                movie: movieId,
                date: new Date(date),
            },
        },
        {
          $group: {
            _id: "$cinema",
            showTimes: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "cinemas",
            localField: "_id",
            foreignField: "_id",
            as: "cinema",
          },
        },
        {
          $unwind: "$cinema",
        },
        {
          $project: {
            _id: 0,
            cinema: 1,
            showTimes: 1,
          },
        },
      ])
      .toArray();

      console.log(pipeline, "????, showtime model");
    return pipeline as IShowTime[];
  }
}
