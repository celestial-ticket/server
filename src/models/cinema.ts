import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { ICinema } from "../interfaces/cinema.ts";

export default class Cinema {
  static coll = db.collection<ICinema>("cinemas");

  static async findAll(): Promise<ICinema[]> {
    const cinemas = await this.coll.find().toArray();
    return cinemas;
  }

  static async findOne(cinemaId: ObjectId): Promise<ICinema | null> {
    return await this.coll.findOne({ _id: cinemaId });
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
            maxDistance: 10 * 1000,
            spherical: true,
          },
        },
      ])
      .toArray()) as ICinema[];
  }
}
