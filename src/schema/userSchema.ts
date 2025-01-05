import { IUser } from "../interfaces/user.ts";
import User from "../models/user.ts";

export const userTypeDefs = `#graphql
    # Type of data we have
    type User{
        _id: ID!
        name: String
        email: String!
        password: String!
        phoneNumber: String
        address: String!
        gender: String
    }

    type UserDetailResponse{
      user: User
    }

     # type query
     type Query {
        users: [User] #get user
        user(_id: ID!): UserDetailResponse #get user by id

    }
`;

export const userResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => {
      return await User.findAll();
    },

    user: async (
      _: unknown,
      args: { _id: string }
    ): Promise<{ user: IUser }> => {
      try {
        const user = await User.findOne(args._id);
        if (!user) {
          throw new Error("User not found");
        }
        return { user };
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error("Failed to fetch user");
      }
    },
  },
};
