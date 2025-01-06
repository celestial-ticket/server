export const studioTypeDefs = `#graphql
    type Studio {
        _id: ID!
        studioNumber: Int
        type: String
        createdAt: String
        updatedAt: String
    }
    
    type Query {
        getStudios: [Studio]
    }
`