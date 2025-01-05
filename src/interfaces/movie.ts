import { ObjectId } from "mongodb";

export interface IMovie {
    _id: ObjectId;
    title: string;
    synopsis: string;
    genre: string;
    duration: string;
    thumbnail: string;
    cast: string[];
    ageRating: string;
    createdAt: Date;
    updatedAt: Date;
}