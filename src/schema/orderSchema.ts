import { ObjectId } from "mongodb";
import { IOrderInput } from "../interfaces/order.ts";
import Order from "../models/order.ts";
import ShowTime from "../models/showtime.ts";
import Cinema from "../models/cinema.ts";
import Movie from "../models/movie.ts";

export const orderTypeDefs = `#graphql
    type Order{
      _id: ID
      paymentStatus: String
      paymentAmount: Int
      price: Int
      seats: [String]
      userId: ID!
      cinemaId: ID!
      showTimeId: ID!
      createdAt: String
      updatedAt: String

      showTime: ShowTime
      cinema: Cinema
      movie: Movie
    }


    # mutation create order
    input OrderInput{
      paymentStatus: String
      paymentAmount: Int
      price: Int
      seats: [String!]
      userId: ID
      cinemaId: ID!
      showTimeId: ID!
      movieId: ID!
    }

    # query find all order by user login and showtime, Cinema, movie, Order
    type Query{
      getOrders: [Order]
      getOrderDetails: [Order]
    }

    type Mutation{
      createOrder(body: OrderInput): Order
    }
`;

export const orderResolvers = {
  Query: {
    getOrders: async () => {
      const orders = await Order.findAll();
      return orders;
    },
    getOrderDetails: async (_: unknown, __: unknown, contextValue: { auth: () => { _id: ObjectId } }) => {
      const user = await contextValue.auth();
      const orders = await Order.findAllByUser(user._id);
      const detailedOrders = await Promise.all(orders.map(async (order) => {
        const showTimeId = new ObjectId(order.showTimeId);
        const showTime = await ShowTime.coll.findOne({ _id: showTimeId });
        const cinema = await Cinema.coll.findOne({ _id: order.cinemaId });
        const movie = await Movie.coll.findOne({ _id: showTime.movieId });
        return {
          ...order,
          showTime,
          cinema,
          movie,
        };
      }));
      return detailedOrders;
    },
  },

  Mutation: {
    createOrder: async (
      _: unknown,
      args,
      contextValue: { auth: () => { _id: ObjectId } }
    ) => {
      const user = await contextValue.auth();
      //payment status default is pending, payment amount is price * seats, price is from showtime
      const { seats, cinemaId, showTimeId, paymentAmount, price, movieId } = args.body as IOrderInput;
      const paymentStatus = "pending";

      const newOrder = {
        userId: user._id,
        cinemaId: new ObjectId(cinemaId),
        showTimeId: new ObjectId(showTimeId),
        movieId: new ObjectId(movieId),
        seats,
        paymentStatus,
        paymentAmount,
        price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const orderId = await Order.createOrder(newOrder);

      return { ...newOrder, _id: orderId };
    },
  },
};
