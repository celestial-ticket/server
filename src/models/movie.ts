import { db } from "../config/db.ts";
import { IMovie } from "../interfaces/movie.ts";

export default class Movie {
    static coll = db.collection<IMovie>("movies");

    static async findAll(): Promise<IMovie[]> {
        const movies = await this.coll.find().toArray();
        return movies;
    }


    //find movie by movie status "now showing"
    static async findByStatus(status: string): Promise<IMovie[]> {
        const movies = await this.coll.find({movieStatus: status}).toArray();
        return movies;
    }


}