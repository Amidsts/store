const request = require("supertest");
import mongoose from "mongoose";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
// import AuthModel from "../../../../components/Auth/auth.model";
import UserModel from "../../../../components/Users/user.model";

jest.mock("../../../../components/Users/user.model", () => ({
  findOne: jest.fn(),
}));

jest.mock("../../../../components/Auth/auth.model", () => ({
  findOne: jest.fn().mockReturnValue({ session: jest.fn() }),
}));

jest.mock("mongoose", () => ({
  startSession: jest.fn().mockReturnValue({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe("user signup", () => {
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should throw error if user already exist", async () => {
    const testUser = {
      _id: "123",
      firstName: "John",
      lastName: "Doe",
      email: "johnna@email.com",
      password: "123_abc",
      phoneNo: "09044456788",
    };

    // const session = mongoose.startSession();
    const findOneMock = jest.fn();
    UserModel.findOne = findOneMock;

    const { body } = await request(app).post("/v1/auth/signup").send(testUser);

    console.log("body: ", body);
    expect(body.message).toBe("Account already exists,please Login instead");
  });

  // it("should create a new user with a success message");
  // it('should handle "internal server error" for catch error');

  it("should return addition answer", async () => {
    let { status } = await request(app).get("/");
    expect(1 + 2).toBe(3);
    expect(status).toBe(200);
  });

  afterAll(async () => {
    await closeMongoDb();
  });
});
