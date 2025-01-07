import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { IOrder, IOrderInput } from "../interfaces/order.ts";

export default class Order {
  static coll = db.collection<IOrder>("orders");

  //find all order by user login and showtime, Cinema, movie, Order
  static async findAll(): Promise<IOrder[]> {
    return this.coll.find().toArray();
  }

  static async findAllByUser(userId: ObjectId): Promise<IOrder[]> {
    return this.coll.find({ userId }).toArray();
  }

  //static create order 
  static async createOrder(body: IOrderInput): Promise<ObjectId> {
    const newOrder: IOrder = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const {insertedId} = await this.coll.insertOne(newOrder)
    return insertedId
  }
}
