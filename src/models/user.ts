import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { IRegisterArgs, type IUser } from "../interfaces/user.ts";
import { hashPassword } from "../helpers/bcrypt.ts";

export default class User {
  static coll = db.collection<IUser>("users");

  static async findAll(): Promise<IUser[]> {
    const users = await this.coll.find().toArray();
    return users;
  }

  static async findOne(_id: string) {
    return await this.coll.findOne({ _id: new ObjectId(_id) });
  }

  static async findEmail(email: string): Promise<IUser | null> {
    return await this.coll.findOne({ email: email });
  }

  // Static for register
  static async register(body : IRegisterArgs['body']) {
    const newUser: IUser = {
      _id: new ObjectId(),
      ...body,
      password: hashPassword(body.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.coll.insertOne(newUser);
  }

  //static update user
  static async update(_id: string, body: IRegisterArgs['body']) {
    const user = await this.coll.findOne({ _id: new ObjectId(_id) });
    if (!user) {
      throw new Error("User not found");
    }
    await this.coll.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...body, 
        createdAt: new Date(),
        updatedAt: new Date() } }
    );
  }
}
