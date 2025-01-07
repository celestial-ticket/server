import { ObjectId } from "mongodb";

export interface ICinema {
  _id: ObjectId;
  name: String;
  address: String;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}
