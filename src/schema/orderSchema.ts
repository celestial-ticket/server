export const orderTypeDefs = `#graphql
    type Order{
      _id: ID!
      paymentStatus: String
      paymentAmount: Int
      price: Int
      status: [String]
      userId: ID!
      cinemaId: ID!
      showTime: ID!
      createdAt: String
      updatedAt: String
    }
`