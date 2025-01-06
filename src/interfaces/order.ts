import { ObjectId } from "mongodb";

export interface ICinema {
  _id: ObjectId;
  paymentStatus: string;
  paymentAmount: number;
  price: number;
  status: [string];
  userId: ObjectId;
  cinemaId: ObjectId;
  showTime: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
