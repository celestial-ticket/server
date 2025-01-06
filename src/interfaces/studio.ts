import { ObjectId } from "mongodb";

export default interface IStudio {
    _id: ObjectId;
    studioNumber: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    }