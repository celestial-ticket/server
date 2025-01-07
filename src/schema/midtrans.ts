// server.js
import { ApolloServer } from "@apollo/server";
import axios from "axios";

// Define GraphQL schema
export const midtransTypeDefs = `#graphql
  type PaymentToken {
    token: String
    redirect_url: String
  }

  type Mutation {
    createPaymentToken(amount: Float!): PaymentToken
  }
`;

export const midtransResolvers = {
  Mutation: {
    createPaymentToken: async (_, { amount }) => {
      try {
        console.log("🚀 ~ createPaymentToken: ~ createPaymentToken");
        const midtransServerKey = process.env.Midtrans_ServerKey; // Midtrans Server Key
        console.log(
          "🚀 ~ createPaymentToken: ~ midtransServerKey:",
          midtransServerKey
        );
        const midtransApiUrl =
          "https://app.sandbox.midtrans.com/snap/v1/transactions"; // Sandbox URL for testing

        // Payment data for Midtrans
        const paymentData = {
          payment_type: "credit_card",
          transaction_details: {
            order_id: `order-${Date.now()}`,
            gross_amount: amount,
          },
          //   credit_card: {
          //     secure: true,
          //   },
        };

        // Request to Midtrans API to get payment token
        const response = await axios.post(midtransApiUrl, paymentData, {
          headers: {
            Authorization: `Basic ${Buffer.from(
              midtransServerKey + ":"
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        });

        // Return payment token and redirect URL
        return {
          token: response.data.token,
          redirect_url: response.data.redirect_url,
        };
      } catch (error) {
        console.error("Error creating payment token", error.response.data);
        throw new Error("Error creating payment token");
      }
    },
  },
};
