import { db } from "../config/db.ts";
import { IMovie } from "../interfaces/movie.ts";

export default class Movie {
    static coll = db.collection<IMovie>("movies");

    static async findAll(): Promise<IMovie[]> {
        const movies = await this.coll.find().toArray();
        return movies;
    }
}