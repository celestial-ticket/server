import { db } from "../config/db";
import { IShowTime } from "../interfaces/showTime";

export default class ShowTime {
    static coll = db.collection<IShowTime>("showTimes");

    
}