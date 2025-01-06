import { ObjectId } from "mongodb";

export interface ICinema {
  _id: ObjectId;
  name: String;
  address: String;
  createdAt: Date;
  updatedAt: Date;
}
