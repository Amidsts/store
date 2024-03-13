const request = require("supertest");
import mongoose from "mongoose";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import { closeMongoDb } from "../../../../configs/database";
import AuthModel from "../../../../components/Auth/auth.model";

jest.mock("../../../../components/Auth/auth.model", () => ({
  findOne: jest.fn(),
}));

jest.mock("mongoose", () => ({
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

    // const AuthModel = "../../../../components/Auth/auth.model";
    let c = (AuthModel.findOne as jest.Mock).mockReturnValue({
      _id: "123",
      firstName: "John",
      lastName: "Doe",
      email: "johnna@email.com",
      password: "123_abc",
      phoneNo: "09044456788",
    });
console.log("c ", c)
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
