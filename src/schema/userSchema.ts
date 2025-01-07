import isEmail from "is-email";
import { comparePassword } from "../helpers/bcrypt.ts";
import { signToken } from "../helpers/jwt.ts";
import { ILoginArgs, IRegisterArgs, IUpdateUser, IUser } from "../interfaces/user.ts";
import User from "../models/user.ts";
import { ObjectId } from "mongodb";
import Order from "../models/order.ts";
import ShowTime from "../models/showtime.ts";
import Cinema from "../models/cinema.ts";
import Movie from "../models/movie.ts";

export const userTypeDefs = `#graphql
    type Location {
      type: String!
      coordinates: [Float!]!
    }

    # Type of data we have
    type User{
      _id: ID!
      name: String
      email: String!
      phoneNumber: String
      address: String!
      location: Location!
      gender: String
      orders: [Order]
    }

    # type query
    type Query {
      users: [User] #get user
      user(_id: ID!): User #get user by id
    }

    # update user
    type UpdateUserResponse {
      user: User
    }

     # input register
    input RegisterForm {
      name: String!
      email: String!
      password: String!
      phoneNumber: String!
      location: LocationInput!
      address: String
      gender: String
    }

    # input update
    input UpdateUserForm {
    name: String
    email: String
    password: String
    phoneNumber: String
    address: String
    gender: String
    location: LocationInput
  }

    # input location
    input LocationInput {
      type: String!
      coordinates: [Float!]!
    }


    # input login
    input LoginForm {
      email: String!
      password: String!
    }

    type LoginResponse {
      user: User
      accessToken: String
    }

    # type mutation
    type Mutation {
      register(body: RegisterForm!): String
      login(input: LoginForm!): LoginResponse
      updateUser( body: UpdateUserForm!): UpdateUserResponse
    }
`;

export const userResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => {
      return await User.findAll();
    },

    user: async (
      _: unknown,
      __: unknown,
      contextValue: { auth: () => { _id: ObjectId } }
    ) => {
      const user = await contextValue.auth();
      const userDetail = await User.findOne(user._id.toString());
      const orders = await Order.findAllByUser(user._id);
      const getOrderDetails = await Promise.all(
        orders.map(async (order) => {
          const showTime = await ShowTime.coll.findOne({
            _id: order.showTimeId,
          });
          const cinema = await Cinema.coll.findOne({ _id: order.cinemaId });
          const movie = await Movie.coll.findOne({ _id: showTime.movieId });
          return {
            ...order,
            showTime,
            cinema,
            movie,
          };
        })
      );
      return {
        ...userDetail,
        orders: getOrderDetails,
      };
    },
  },

  Mutation: {
    async register(_: unknown, args: IRegisterArgs) {
      if (!args.body.name) {
        throw new Error("Name is required");
      }
      if (!args.body.email) {
        throw new Error("Email is required");
      }
      if (!args.body.password) {
        throw new Error("Password is required");
      }
      if (!args.body.phoneNumber) {
        throw new Error("phone number is required");
      }
      if (!isEmail(args.body.email)) {
        throw new Error("Email format is invalid");
      }

      const existingEmail = await User.findEmail(args.body.email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      await User.register(args.body);
      return "Register Success";
    },

    async login(_: unknown, args: ILoginArgs) {
      if (!args.input.email) throw new Error("email is required");
      if (!args.input.password) throw new Error("Password is required");

      const user = await User.coll.findOne({ email: args.input.email });
      if (!user) throw new Error("Invalid email/password");
      const isValidPassword = comparePassword(
        args.input.password,
        user.password
      );

      if (!isValidPassword) throw new Error("Invalid email/password");

      const accessToken = signToken({
        _id: user._id.toString(),
        email: user.email,
      });
      console.log(accessToken, "ini token");
      return {
        user,
        accessToken,
      };
    },

    async updateUser(
      _: unknown,
      args: { body: IUpdateUser["body"] },
      contextValue: { auth: () => { _id: ObjectId } }
    ) {
      const userLogin = await contextValue.auth();
      console.log("🚀 ~ userLogin:", userLogin)
      await User.update(userLogin._id, args.body);
      const user = await User.findOne(userLogin._id.toString());
      return { user };
    },
  },
};
