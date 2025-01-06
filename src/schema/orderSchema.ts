import { ObjectId } from "mongodb";
import { IOrderInput } from "../interfaces/order.ts";
import Order from "../models/order.ts";

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
    }

    # query find all order by user login and showtime, Cinema, movie, Order
    type Query{
      getOrders: [Order]

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
  },

  Mutation: {
    createOrder: async (
      _: unknown,
      args,
      contextValue: { auth: () => { _id: ObjectId } }
    ) => {
      const user = await contextValue.auth();
      console.log(args, "======= args");
      //payment status default is pending, payment amount is price * seats, price is from showtime
      const { seats, cinemaId, showTimeId, paymentAmount, price } = args.body as IOrderInput;
      const paymentStatus = "pending";

      const newOrder = {
        userId: user._id,
        cinemaId: new ObjectId(cinemaId),
        showTimeId: new ObjectId(showTimeId),
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
