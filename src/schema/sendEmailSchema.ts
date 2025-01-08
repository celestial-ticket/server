import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Define your type definitions
export const sendEmailTypeDefs = `#graphql

  input SendEmailInput {
    movie: String!
    date: String!
    time: String!
    cinema: String!
    seats: [String!]!
    totalPrice: String!
    orderId: String!
  }

  type Mutation {
    sendEmail(email: String!, order: SendEmailInput!): String
  }
`;

// Define your resolvers
export const sendEmailResolvers = {
  Mutation: {
    sendEmail: async (_, { email, order }) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "headbang477@gmail.com",
          pass: "lfhm quea ceay epbc",
        },
      });

      const qrCodeSVG = await QRCode.toString(order.orderId);
      const mailOptions = {
        from: "headbang477@gmail.com",
        to: email,
        subject: "Your Movie Ticket",
        html: `
        <html>
        <body>
          <h1>Movie Ticket</h1>
          <p>Movie: ${order.movie}</p>
          <p>Date: ${order.date}</p>
          <p>Time: ${order.time}</p>
          <p>Cinema: ${order.cinema}</p>
          <p>Seats: ${order.seats.join(", ")}</p>
          <p>Total Payment: ${order.totalPrice}</p>
          <p>Transaction Code: ${order.orderId}</p>
        <pre style="font-family: monospace;">${qrCodeSVG}</pre>
        </body>
        </html>
          `,
      };

      try {
        await transporter.sendMail(mailOptions);
        return "Email sent successfully";
      } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
      }
    },
  },
};
