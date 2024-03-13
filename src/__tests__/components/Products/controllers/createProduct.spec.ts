import request from "supertest";

import app, {
  initializeDatabase,
  initializeMiddlewares,
  initializeRoutes,
} from "../../../../app";
import AuthModel from "../../../../components/Auth/auth.model";
import { closeMongoDb } from "../../../../configs/database";
import { saveTestData } from "../../Auth/authTestData";
import { productTestData, saveProductTestData } from "../productTestData";
import ProductModel from "../../../../components/Products/product.model";
import * as response from "../../../../utils/response";

describe("Create a product", () => {
  let user: any, product: any, token: string;
  beforeAll(async () => {
    await initializeDatabase();
    initializeMiddlewares();
    initializeRoutes();

    user = await saveTestData().userAuth.save();
    product = await saveProductTestData().product(user._id).save();
    token = user.generateToken({ data: { ref: user._id, role: user.role } });
  });

  it("Should throw error that product already exist", async () => {
    const responseHandlerSpy = jest.spyOn(response, "responseHandler");

    const { body, status } = await request(app)
      .post("/v1/product")
      .send(productTestData)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

      expect(responseHandlerSpy).toHaveBeenCalled();
    expect(body.message).toBe("this product already exists");
    expect(status).toBe(400);
  });

  it("Should create a new product and save to the database", async () => {
    await ProductModel.deleteMany();
    const { body, status } = await request(app)
      .post("/v1/product")
      .send(productTestData)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(body.message).toBe("product created successfully");
    expect(status).toBe(200);
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    
    await AuthModel.deleteMany();
    await ProductModel.deleteMany();
    await closeMongoDb();
  });
});
