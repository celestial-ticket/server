import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { ICinema } from "../interfaces/cinema.ts";
import { pipeline } from "stream";

export default class Cinema {
  static coll = db.collection<ICinema>("cinemas");

  static async findAll(): Promise<ICinema[]> {
    const cinemas = await this.coll.find().toArray();
    return cinemas;
  }

  static async findById(cinemaId: string): Promise<ICinema | null> {
    return await this.coll.findOne({ _id: new ObjectId(cinemaId) });
  }

  // Find nearby cinemas
  static async findNearby(
    location: { type: string; coordinates: [number, number] },
    maxDistance: number
  ): Promise<ICinema[]> {
    return (await this.coll
      .aggregate([
        {
          $geoNear: {
            near: location,
            distanceField: "distance",
            maxDistance: maxDistance * 1000 || 25 * 10000,
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "showTimes",
            localField: "_id",
            foreignField: "cinemaId",
            as: "showTimes",
          },
        },
        // { $unwind: "$showTimes" },
      ])
      .toArray()) as ICinema[];
  }

  static async create(cinema: ICinema): Promise<ICinema> {
    const result = await this.coll.insertOne(cinema);
    return { ...cinema, _id: result.insertedId };
  }

  static async update(id: string, cinema: ICinema): Promise<ICinema> {
    await this.coll.updateOne({ _id: new ObjectId(id) }, { $set: cinema });
    return { ...cinema, _id: new ObjectId(id) };
  }

  static async delete(id: string): Promise<ICinema> {
    const cinema = await this.findById(id);
    await this.coll.deleteOne({ _id: new ObjectId(id) });
    return cinema;
  }
}
