import { ObjectId } from "mongodb";

export interface ISeat {
    seat: string;
    status: string;
}

export interface IShowTime {
    _id: ObjectId;
    startTime: Date;    
    endTime: Date;      
    date: Date;
    price: number;         
    seatList: ISeat[];  
    studioId: ObjectId; 
    movieId: ObjectId;  
    cinemaId: ObjectId; 
}
