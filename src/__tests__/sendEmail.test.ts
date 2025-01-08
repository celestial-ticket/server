import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
  jest,
} from "@jest/globals";
import request from "supertest";
import nodemailer from "nodemailer";
import { createApolloServer } from "../index";
import { db } from "../config/db";

jest.mock("nodemailer");

const mockSendMail = jest.fn();
nodemailer.createTransport.mockReturnValue({
  sendMail: mockSendMail,
});

let server;
let url;

describe("sendEmail Mutation", () => {
  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }));
  });

  afterAll(async () => {
    await server?.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send an email successfully", async () => {
    mockSendMail.mockResolvedValueOnce({});

    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation {
            sendEmail(email: "recipient@example.com", order: {
              movie: "Example Movie",
              date: "2023-10-10",
              time: "18:00",
              cinema: "Example Cinema",
              seats: ["A1", "A2"],
              totalPrice: "100",
              orderId: "123456"
            })
          }
        `,
      });

    console.log("Response body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.sendEmail).toBe("Email sent successfully");
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "headbang477@gmail.com",
        to: "recipient@example.com",
        subject: "Your Movie Ticket",
        html: expect.stringContaining("Example Movie"),
      })
    );
  });

  it("should fail to send an email", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("Failed to send email"));

    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation {
            sendEmail(email: "recipient@example.com", order: {
              movie: "Example Movie",
              date: "2023-10-10",
              time: "18:00",
              cinema: "Example Cinema",
              seats: ["A1", "A2"],
              totalPrice: "100",
              orderId: "123456"
            })
          }
        `,
      });

    console.log("Response body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toBe("Failed to send email");
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });
});
