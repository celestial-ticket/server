export const studioTypeDefs = `#graphql
    # Type of data we have
    type Studio{
        _id: ID!
        studioNumber: Integer!
        type: String!
        createdAt: String
        updatedAt: String
        cinema: Cinema
    }
    
`;
