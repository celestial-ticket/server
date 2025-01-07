import { ObjectId } from "mongodb";

export interface IOrder {
  _id?: ObjectId;
  paymentStatus: string;
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
  price: number;
  seats: [string];
  userId: ObjectId;
  cinemaId: ObjectId;
  showTimeId: ObjectId;
  movieId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
