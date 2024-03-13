import axios from "axios";
import { IAuth } from "../Auth/auth.model";
import appConfig from "../../configs";

const { paystackSecret } = appConfig;

export async function createCustomer(user: IAuth) {
  try {
    const customerExists = await axios.get(
      `https://api.paystack.co/customer/${user.email}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    if (!customerExists) {
      await axios.post(
        "https://api.paystack.co/customer",
        {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phoneNo,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    return;
  } catch (error) {
    throw error;
  }
}

export async function initializePayment({
  email,
  amount,
  currency,
}: {
  email: string;
  amount: string;
  currency: string;
}) {
  try {
    const { data } = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        currency,
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
}
