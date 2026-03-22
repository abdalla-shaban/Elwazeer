import { BASE_URL } from "@/constants";
import { CartResponse } from "@/types/cart";
import { cookies } from "next/headers";

export const getCartDataServer = async (): Promise<CartResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/cart/getCart`, {
      headers: {
        Cookie: (await cookies()).toString(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg ? errorMsg.message : errorMsg);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
