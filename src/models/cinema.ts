import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { ICinema } from "../interfaces/cinema.ts";


export default class Cinema {
  static coll = db.collection<ICinema>("cinemas");

  static async findAll(): Promise<ICinema[]> {
    const cinemas = await this.coll.find().toArray();
    return cinemas;
  }

  static async findOne(_id: string) {
    return await this.coll.findOne({ _id: new ObjectId(_id) });
  }
}
