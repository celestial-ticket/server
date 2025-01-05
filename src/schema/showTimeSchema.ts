export const showTimeTypeDefs = `#graphql
    # Type of data we have
    type ShowTime {
    _id: ID!
    startTime: String
    endTime: String
    date: String
    seatList: [Seat]
    studio: Studio
    movie: Movie
    cinema: Cinema
    }

    type Seat {
        seat: String
        status: String
    }   


`;
