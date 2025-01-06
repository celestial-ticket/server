import { ObjectId } from "mongodb";

export interface IOrder {
  _id?: ObjectId;
  paymentStatus: string;
  paymentAmount: number;
  price: number;
  seats: [string];
  userId: ObjectId;
  cinemaId: ObjectId;
  showTimeId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderInput {
  paymentStatus: string;
  paymentAmount: number;
  price: number;
  seats: [string];
  userId: ObjectId;
  cinemaId: ObjectId;
  showTimeId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
