import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { type IUser } from "../interfaces/user.ts";

export default class User {
  static coll = db.collection<IUser>("users");

  static async findAll(): Promise<IUser[]> {
    const users = await this.coll.find().toArray();
    return users;
  }

  static async findOne(_id: string) {
    return await this.coll.findOne({ _id: new ObjectId(_id) });
  }
}
