import { ObjectId } from "mongodb";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginArgs {
  input: {
    email: string;
    password: string;
  };
}

export interface IRegisterArgs {
  body: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address?: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    gender: string;
    createdAt: Date;
    updatedAt: Date;
  };
}


export interface IUpdateUser {
  body: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    gender: string;
    createdAt: Date;
    updatedAt: Date;
  };
}


