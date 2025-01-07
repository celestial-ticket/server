import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  console.log("Loading .env file");
  dotenv.config();
}

import request from "supertest";
import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from "../schema/userSchema.ts";
import { cinemaResolvers, cinemaTypeDefs } from "../schema/cinemaSchema.ts";
import { verifyToken } from "../helpers/jwt.ts";
import { movieResolvers, movieTypeDefs } from "../schema/movieSchema.ts";
import { midtransResolvers, midtransTypeDefs } from "../schema/midtrans.ts";
import User from "../models/user.ts";
import { IUser } from "../interfaces/user.ts";
import { ObjectId, WithId } from "mongodb";
// import the server after dotenv.config() is called
import { createApolloServer } from "../index.ts";
import { db } from "../config/db.ts";

let server;
let url;

interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  res: unknown;
}

let movieId: ObjectId;
let cinemaId: ObjectId;
let studioId: ObjectId;
let showTimeId: ObjectId;

const cinema = {
  name: "Cinema 21 Plaza Senayan",
  address: "Plaza Senayan, Jakarta, Indonesia",
  location: {
    type: "Point",
    coordinates: [106.798, -6.227],
  },
  createdAt: "2023-01-10T10:00:00Z",
  updatedAt: "2023-01-10T10:00:00Z",
  studios: [
    {
      studioNumber: 1,
      type: "2D",
      cinemaID: cinemaId,
    },
    {
      studioNumber: 2,
      type: "3D",
      cinemaID: cinemaId,
    },
    {
      studioNumber: 3,
      type: "2D",
      cinemaID: cinemaId,
    },
    {
      studioNumber: 4,
      type: "IMAX",
      cinemaID: cinemaId,
    },
    {
      studioNumber: 5,
      type: "4DX",
      cinemaID: cinemaId,
    },
  ],
};

const movie = {
  thumbnail: "https://example.com/moana2-thumbnail.jpg",
  title: "Moana 2: The Return of the Ocean",
  duration: 120,
  genre: "Animation, Adventure Fantasy",
  synopsis:
    "Moana kembali berlayar dalam petualangan epik untuk menyelamatkan desanya dari ancaman baru. Kali ini, ia harus menjelajahi lautan yang lebih luas, menemukan rahasia keluarganya, dan bekerja sama dengan teman lama serta sekutu baru.",
  cast: [
    "\"Auli'i Cravalho",
    "Dwayne Johnson",
    "Temuera Morrison",
    "Rachel House",
  ],
  ageRating: "U",
  movieStatus: "Now Showing",
};

const showTime = {
  movieId,
  studioId,
  cinemaId,
  startTime: new Date("2025-01-10T10:00:00.000Z"),
  endTime: new Date("2025-01-10T12:00:00.000Z"),
  date: new Date("2025-01-10T00:00:00.000Z"),
  price: 40000,
  studioNumber: 1,
  cinemaName: "Cinema 21 Plaza Senayan",
  movieTitle: "Moana 2: The Return of the Ocean",
  seatList: [
    ["A1", "available"],
    ["A2", "available"],
    ["A3", "available"],
    ["A4", "available"],
    ["A5", "available"],
    ["A6", "available"],
    ["A7", "available"],
    ["A8", "available"],
    ["A9", "available"],
    ["A10", "available"],
    ["A11", "available"],
    ["A12", "available"],
    ["B1", "available"],
    ["B2", "available"],
    ["B3", "available"],
    ["B4", "available"],
    ["B5", "available"],
    ["B6", "available"],
    ["B7", "available"],
    ["B8", "available"],
    ["B9", "available"],
    ["B10", "available"],
    ["B11", "available"],
    ["B12", "available"],
    ["C1", "available"],
    ["C2", "available"],
    ["C3", "available"],
    ["C4", "available"],
    ["C5", "available"],
    ["C6", "available"],
    ["C7", "available"],
    ["C8", "available"],
    ["C9", "available"],
    ["C10", "available"],
    ["C11", "available"],
    ["C12", "available"],
    ["D1", "available"],
    ["D2", "available"],
    ["D3", "available"],
    ["D4", "available"],
    ["D5", "available"],
    ["D6", "available"],
    ["D7", "available"],
    ["D8", "available"],
    ["D9", "available"],
    ["D10", "available"],
    ["D11", "available"],
    ["D12", "available"],
    ["E1", "available"],
    ["E2", "available"],
    ["E3", "available"],
    ["E4", "available"],
    ["E5", "available"],
    ["E6", "available"],
    ["E7", "available"],
    ["E8", "available"],
    ["E9", "available"],
    ["E10", "available"],
    ["E11", "available"],
    ["E12", "available"],
  ],
};

const studio = {
  studioNumber: 1,
  type: "2D",
  cinemaID: cinemaId,
};
describe("GraphQL Endpoints", () => {
  beforeAll(async () => {
    console.log("MONGODB_URI inside beforeAll:", process.env.MONGODB_URI);
    server = new ApolloServer({
      typeDefs: [userTypeDefs, cinemaTypeDefs, movieTypeDefs, midtransTypeDefs],
      resolvers: [
        userResolvers,
        cinemaResolvers,
        movieResolvers,
        midtransResolvers,
      ],
    });

    const { url: serverUrl } = await startStandaloneServer<any>(server, {
      listen: {
        port: 0,
      },
      context: async ({ req, res }: Context) => {
        //async function authorization
        async function auth(): Promise<WithId<IUser>> {
          const { authorization } = req.headers;
          // console.log(req.headers, "<<<");
          if (!authorization) throw new Error("Invalid Token");
          const [type, token] = authorization.split(" ");
          if (type !== "Bearer" || !token) throw new Error("Invalid Token");
          const payload = verifyToken(token);
          if (typeof payload !== "string" && payload._id) {
            const user = await User.findOne(payload._id as string);
            return user;
          }
          throw new Error("Invalid Token");
        }
        return { auth };
      },
    });
    url = serverUrl;

    console.log("Inserting test data...");

    // Insert cinema
    const cinemaResponse = await db.collection("cinemas").insertOne(cinema);
    cinemaId = cinemaResponse.insertedId;
    console.log("Inserted cinema with id:", cinemaId);

    // Insert studio
    const studioResponse = await db.collection("studios").insertOne(studio);
    studioId = studioResponse.insertedId;
    console.log("Inserted studio with id:", studioId);

    //THE PROBLEM IS BECAUSE THE COLLECTION NAME IS WRONG, BEFORE IT MOVIE, AND
    // IN MODEL IT SHOULD BE MOVIES (GOOD GOD)
    // Insert movie
    const movieResponse = await db.collection("movies").insertOne(movie);
    movieId = movieResponse.insertedId;
    console.log("Inserted movies with id:", movieId);

    // Insert showtime
    const showResponse = await db.collection("showTimes").insertOne(showTime);
    showTimeId = showResponse.insertedId;
    console.log("Inserted showtime with id:", showTimeId);

    await db.collection("orders").insertOne({});
    await db.collection("users").insertOne({});
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await db.collection("cinemas").deleteMany({});
    await db.collection("movies").deleteMany({});
    await db.collection("orders").deleteMany({});
    await db.collection("showTimes").deleteMany({});
    await db.collection("studios").deleteMany({});
    await db.collection("users").deleteMany({});
    await server?.stop();
  });

  it("should register a user", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation {
            register(body: {
              name: "Test User",
              email: "test@example.com",
              password: "123456",
              phoneNumber: "1234567890",
              gender: "Male"
            })
          }
        `,
      });
    // console.log("🚀 ~ it ~ should register a user:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.register).toBe("Register Success");
  });

  it("should fail to register a user with existing email", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
                mutation {
                  register(body: {
                    name: "Test User",
                    email: "test@example.com",
                    password: "123456",
                    phoneNumber: "1234567890",
                    gender: "Male"
                  })
                }
              `,
      });

    console.log("🚀 ~ it ~ response.body:", response.status);
    // expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Email already exists");
  });

  it("should login a user", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation {
            login(input: {
              email: "test@example.com",
              password: "123456",
            }) {
              user {
                _id
                name
              }
              accessToken
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    // console.log("🚀 ~ it ~ response:", response.body.data.login);
    expect(response.body.data.login.user.name).toBe("Test User");
    expect(response.body.data.login.accessToken).toBeDefined();
  });

  it("should fail to login a user with incorrect password", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
                mutation {
                  login(input: {
                    email: "test@example.com",
                    password: "wrongpassword",
                  }) {
                    user {
                      _id
                      name
                    }
                    accessToken
                  }
                }
              `,
      });

    // expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Invalid email/password");
  });

  it("should get all cinemas", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query {
            cinemas {
              _id
              name
              address
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.cinemas).toBeInstanceOf(Array);
  });

  it("should get a specific cinema by ID", async () => {
    const cinemaID = cinemaId.toString(); // Replace with a valid cinema ID
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
              query {
                cinema(_id: "${cinemaID}") {
                  cinema {
                    _id
                    name
                    address
                    createdAt
                    updatedAt
                  }
                }
              }
              `,
      });

    // console.log(response.body.data);
    // console.log("🚀 ~ it ~ response.body.data:", response.body.data.cinema._id);
    expect(response.status).toBe(200);
    expect(response.body.data.cinema).toBeDefined();
    expect(response.body.data.cinema.cinema._id).toBe(cinemaID);
  });

  it("should get all movies", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query {
            movies {
              _id
              title
              synopsis
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.movies).toBeInstanceOf(Array);
  });

  it("should get a specific movie by ID", async () => {
    const movieID = movieId.toString(); // Replace with a valid movie ID

    const queryData = {
      query: `
      query($id: String!) {
        movie(_id: $id) {
          _id
          title
          synopsis
          genre
          duration
          thumbnail
          cast
          ageRating
          movieStatus
          createdAt
          updatedAt
        }
      }
    `,
      variables: {
        id: movieID,
      },
    };

    console.log("🚀 ~ it ~ movieID:", movieID);

    // // Confirm inserted data
    // const insertedMovies = await db.collection("movies").find().toArray();
    // console.log("Inserted movies:", insertedMovies);

    // Send the query to the Apollo server
    const response = await request(url).post("/graphql").send(queryData);

    // Log the response to see errors and data
    // console.log("🚀 ~ it ~ response.body:", response.body);

    // Check for any errors
    if (response.body.errors) {
      console.error("GraphQL errors:", response.body.errors);
    }

    expect(response.status).toBe(200);
    expect(response.body.data.movie).toBeDefined();
    expect(response.body.data.movie._id).toBe(movieID);
  });

  it("should create a payment token", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
         mutation {
          createPaymentToken(amount: 100000) {
            token
            redirect_url
          }
        }
        `,
      });

    expect(response.status).toBe(200);
    console.log("🚀 ~ it ~ payment:", response.body.data);
    expect(response.body.data.createPaymentToken.token).toBeDefined();
    expect(response.body.data.createPaymentToken.redirect_url).toBeDefined();
  });
});
