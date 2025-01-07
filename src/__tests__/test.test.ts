import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  console.log("Loading .env file");
  dotenv.config();
}

import request from "supertest";
import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";

import { ObjectId } from "mongodb";
import { db } from "../config/db.ts";
import { createApolloServer } from "../index.ts";
import { ApolloServer } from "@apollo/server";
import { hashPassword } from "../helpers/bcrypt.ts";
interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  res: unknown;
}

let server: any;
let url: string;
let movieId: ObjectId;
let cinemaId: ObjectId;
let studioId: ObjectId;
let showTimeId: ObjectId;
let orderId: ObjectId;
let userId: ObjectId;
let token: string;

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

const studio = {
  studioNumber: 1,
  type: "2D",
  cinemaID: cinemaId,
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

const movieUpcoming = {
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
  movieStatus: "Upcoming",
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

const user = {
  email: "test@gmail.com",
  location: {
    coordinates: [106.75441244745133, -6.238094806151674],
    type: "Point",
  },
  password: "123456",
  phoneNumber: "1122331122",
  name: "Test User",
  address: "test",
  gender: "m",
};

const user1 = {
  email: "user1@gmail.com",
  location: {
    coordinates: [106.75441244745133, -6.238094806151674],
    type: "Point",
  },
  password: hashPassword("123456"),
  phoneNumber: "1122331122",
  name: "Test User",
  address: "test",
  gender: "m",
};

const order = {
  userId,
  showTimeId,
  seats: ["A1", "A2"],
  totalPrice: 200,
};

describe("GraphQL Endpoints", () => {
  beforeAll(async () => {
    console.log("MONGODB_URI inside beforeAll:", process.env.MONGODB_URI);
    ({ server, url } = await createApolloServer({ port: 0 }));

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
    await db.collection("movies").insertOne(movieUpcoming);

    // Insert showtime
    const showResponse = await db.collection("showTimes").insertOne(showTime);
    showTimeId = showResponse.insertedId;
    console.log("Inserted showtime with id:", showTimeId);

    // Insert order
    const orderResponse = await db.collection("orders").insertOne(order);
    orderId = orderResponse.insertedId;
    console.log("Inserted order with id:", orderId);

    // Insert user
    const userResponse = await db.collection("users").insertOne(user1);
    userId = userResponse.insertedId;
    console.log("Inserted user with id:", userId);

    // Login user to get access token
    const loginResponse = await request(url)
      .post("/graphql")
      .send({
        query: `
         mutation Mutation($input: LoginForm!) {
            login(input: $input) {
              accessToken
            }
          }
        `,
        variables: {
          input: {
            email: user1.email,
            password: "123456",
          },
        },
      });

    console.log("🚀 ~ beforeAll ~ loginResponse.body:", loginResponse.body);
    token = loginResponse.body.data.login?.accessToken;
    console.log("User logged in with access token:", token);
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await db.collection("cinemas").deleteMany({});
    await db.collection("movies").deleteMany({});
    await db.collection("orders").deleteMany({});
    await db.collection("showTimes").deleteMany({});
    await db.collection("studios").deleteMany({});
    await server?.stop();
  });

  //=============================== USER TEST ======================================

  it("should register a user", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation Mutation($body: RegisterForm!) {
            register(body: $body)
          }
        `,
        variables: {
          body: user,
        },
      });
    console.log("🚀 ~ it ~ should register a user:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.register).toBe("Register Success");
  });

  it("should fail to register a user with existing email", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation Mutation($body: RegisterForm!) {
            register(body: $body)
          }
        `,
        variables: {
          body: user,
        },
      });
    console.log("🚀 ~ it ~ response.body:", response.body);
    // expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Email already exists");
  });

  it("should return error if required fields are missing during registration", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation Mutation($body: RegisterForm!) {
            register(body: $body)
          }
        `,
        variables: {
          body: {
            name: "",
            email: "",
            password: "",
            location: user.location,
            phoneNumber: "0987654321",
            address: "456 New St",
            gender: "Female",
          },
        },
      });
    console.log("🚀 ~ it ~ register bad request.body:", response.body);
    // expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Name is required");
  });

  it("should login a user", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation {
            login(input: {
              email: "test@gmail.com",
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

    console.log("🚀 ~ it ~ response:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.login?.user.name).toBe("Test User");
    expect(response.body.data.login?.accessToken).toBeDefined();
    // token = response.body.data.login?.accessToken;
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

  //=============================== MOVIE TEST ======================================

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

    // Check for any errors
    if (response.body.errors) {
      console.error("GraphQL errors:", response.body.errors);
    }

    console.log("🚀 ~ it ~ response.body:", response.status);
    expect(response.status).toBe(200);
    expect(response.body.data.movie).toBeDefined();
    expect(response.body.data.movie._id).toBe(movieID);
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
                query Query($id: ID!) {
                  cinema(_id: $id) {
                    _id
                    name
                    address
                    location {
                      type
                      coordinates
                    }
                    createdAt
                    updatedAt
                  }
                }
              `,
        variables: { id: cinemaID },
      });

    // console.log("🚀 ~ it ~ response.body.data:", response.body.data);
    // expect(response.status).toBe(200);
    expect(response.body.data.cinema).toBeDefined();
    expect(response.body.data.cinema._id).toBe(cinemaID);
  });

  it("should return error if cinema not found", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query Query($id: ID!) {
            cinema(_id: $id) {
              _id
              name
              address
            }
          }
        `,
        variables: { id: "nonexistentid" },
      });

    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toBe("Failed to fetch cinema");
  });

  it("should get nearby cinemas", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query GetNearbyCinemas($userLocation: LocationInput!, $maxDistance: Float!) {
            getNearbyCinemas(userLocation: $userLocation, maxDistance: $maxDistance) {
              _id
              name
              address
              location {
                type
                coordinates
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          userLocation: {
            type: "Point",
            coordinates: [106.75441244745133, -6.238094806151674],
          },
          maxDistance: 10000,
        },
      });

    console.log("🚀 ~ it ~ nearbyCinema.body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.getNearbyCinemas).toBeInstanceOf(Array);
    expect(response.body.data.getNearbyCinemas.length).toBeGreaterThan(0);
  });

  it("should create a cinema", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        mutation CreateCinema($input: CinemaInput!) {
          createCinema(input: $input) {
            _id
            name
            address
            location {
              type
              coordinates
            }
            createdAt
            updatedAt
          }
        }
      `,
        variables: {
          input: {
            name: "New Cinema",
            address: "456 New St",
            location: {
              type: "Point",
              coordinates: [106.75441244745133, -6.238094806151674],
            },
          },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createCinema).toBeDefined();
    expect(response.body.data.createCinema.name).toBe("New Cinema");
  });

  it("should update a cinema", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        mutation UpdateCinema($id: ID!, $input: CinemaInput!) {
          updateCinema(_id: $id, input: $input) {
            _id
            name
            address
            location {
              type
              coordinates
            }
            createdAt
            updatedAt
          }
        }
      `,
        variables: {
          id: cinemaId.toString(),
          input: {
            name: "Updated Cinema",
            address: "789 Updated St",
            location: {
              type: "Point",
              coordinates: [106.75441244745133, -6.238094806151674],
            },
          },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.updateCinema).toBeDefined();
    expect(response.body.data.updateCinema.name).toBe("Updated Cinema");
  });

  it("should delete a cinema", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        mutation DeleteCinema($id: ID!) {
          deleteCinema(_id: $id) {
            _id
            name
            address
          }
        }
      `,
        variables: { id: cinemaId.toString() },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteCinema).toBeDefined();
    expect(response.body.data.deleteCinema._id).toBe(cinemaId.toString());
  });

  it("should get all showtimes", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query GetShowTimes($date: String!, $userLocation: LocationInput!, $movieId: ID!) {
            getShowTimes(date: $date, userLocation: $userLocation, movieId: $movieId) {
              _id
              cinema {
                _id
                name
                address
                createdAt
                updatedAt
              }
              showTimes {
                _id
                startTime
                endTime
                date
                price
                seatList
                studioId
                movieId
                cinemaId
                cinema {
                  name
                }
                movie {
                  title
                }
              }
            }
          }
        `,
        variables: {
          date: "2025-01-10",
          userLocation: {
            coordinates: [106.75441244745133, -6.238094806151674],
            type: "Point",
          },
          movieId: "677a9c58aec600a3cbc41736",
        },
      });
    console.log(
      "🚀 ~ it ~ response.body:",
      response.body.data.getShowTimes[0].showTimes
    );
    expect(response.status).toBe(200);
    expect(response.body.data.getShowTimes[0].showTimes).toBeInstanceOf(Array);
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

  it("should create an order", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation CreateOrder($body: OrderInput) {
            createOrder(body: $body) {
              _id
              cinemaId
              showTimeId
              userId
            }
          }
        `,
        variables: {
          body: {
            cinemaId,
            movieId,
            price: 100_000,
            showTimeId,
          },
        },
      })
      .set("Authorization", `Bearer ${token}`);
    console.log("🚀 ~ it ~ response.body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.createOrder).toBeDefined();
    expect(response.body.data.createOrder.userId).toBeDefined();
  });

  it("should get all orders", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        query Query {
          getOrders {
            _id
            paymentStatus
            price
            seats
            userId
            cinemaId
            showTimeId
            createdAt
            updatedAt
            movie {
              title
            }
          }
        }
        `,
      });
    console.log("🚀 ~ it ~ response.body:", response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.getOrders).toBeInstanceOf(Array);
  });

  it("should get an order by User", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query Query {
            getOrderDetails {
              _id
            }
          }
        `,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.getOrderDetails).toBeInstanceOf(Array);
  });

  it("should get all users", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
            query Query {
              users {
                _id
              }
            }
        `,
      });
    // expect(response.status).toBe(200);
    expect(response.body.data.users).toBeInstanceOf(Array);
  });

  it("should get a user by ID", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          query Query {
            user {
              _id
            }
          }
        `,
      })
      .set("Authorization", `Bearer ${token}`);

    console.log("🚀 ~ it ~ response.body:", response.body.data.user._id);
    // expect(response.status).toBe(200);
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data?.user._id).toBe(userId.toString());
  });

  it("should update a user", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
          mutation Mutation($body: UpdateUserForm!) {
            updateUser(body: $body) {
              user {
                _id
                name
                email
                phoneNumber
                address
                gender
              }
            }
          }
        `,
        variables: {
          body: {
            name: "ikan",
          },
        },
      })
      .set("Authorization", `Bearer ${token}`);
    console.log("🚀 ~ it ~ response.body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.updateUser.user).toBeDefined();
    expect(response.body.data.updateUser.user.name).toBe("ikan");
  });

  it("should get movies with status 'Now Showing'", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        query {
          nowShowing {
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
      });

    expect(response.status).toBe(200);
    expect(response.body.data.nowShowing).toBeInstanceOf(Array);
    expect(response.body.data.nowShowing.length).toBeGreaterThan(0);
    expect(response.body.data.nowShowing[0].movieStatus).toBe("Now Showing");
  });

  it("should get movies with status 'Upcoming'", async () => {
    const response = await request(url)
      .post("/graphql")
      .send({
        query: `
        query {
          upcoming {
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
      });

    expect(response.status).toBe(200);
    expect(response.body.data.upcoming).toBeInstanceOf(Array);
    expect(response.body.data.upcoming.length).toBeGreaterThan(0);
    expect(response.body.data.upcoming[0].movieStatus).toBe("Upcoming");
  });
});
