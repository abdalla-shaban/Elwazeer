import { BASE_URL } from "@/constants";
import {
  ILoginCredentials,
  IRegisterCredentials,
  IUserRoleResponse,
} from "@/types/auth";
import { CartResponse } from "@/types/cart";
import { OrdersResponse } from "@/types/orders";
import { ProductDetailsResponse } from "@/types/productDetails";
import {
  IProductBody,
  IProductsResponse,
  IRelatedProductsResponse,
  IWishlistRes,
  SizeDescription,
} from "@/types/products";
import { SettingsResponse } from "@/types/settings";

export const currentUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user/authMe`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const signin = async (credentials: ILoginCredentials) => {
  try {
    const res = await fetch(`${BASE_URL}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const signup = async (credentials: IRegisterCredentials) => {
  try {
    const res = await fetch(`${BASE_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const toggleUserRole = async ({ email }: { email: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const getOperationRoleUsers = async (): Promise<IUserRoleResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const addProduct = async (body: IProductBody) => {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
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
export const updateProduct = async ({
  product_id,
  body,
}: {
  product_id: string;
  body: IProductBody;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${product_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
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

export const deleteProduct = async (product_id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${product_id}`, {
      method: "DELETE",
      credentials: "include",
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
export const toggleAvilability = async (product_id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/product/${product_id}`, {
      method: "PATCH",
      credentials: "include",
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

export const addOrUpdateOffer = async ({
  product_id,
  offerBody,
}: {
  product_id: string;
  offerBody: {
    isAvailable: boolean;
    percent: string;
  };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/product/add-offer/${product_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerBody),
      credentials: "include",
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

export const getProducts = async ({
  q = "",
  page = 1,
  limit = 20,
  category = "",
  fabric = "",
  season = "",
  minPrice = "",
  maxPrice = "",
  color = "",
  size = "",
  sort = "",
  isAvailable = "",
  productType = "",
  ageGroup = "",
}: {
  page?: number;
  limit?: number;
  category?: string;
  fabric?: string;
  season?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  color?: string;
  size?: string;
  range?: string;
  q?: string;
  isAvailable?: boolean | string;
  sort?: string;
  productType?: string;
  ageGroup?: string;
}): Promise<IProductsResponse> => {
  try {
    const res = await fetch(
      `${BASE_URL}/products/?isAvailable=${isAvailable}&limit=${limit}&page=${page}&q=${q}&category=${category}&fabric=${fabric}&season=${season}&minPrice=${minPrice}&maxPrice=${maxPrice}&color=${color}&size=${size}&sort=${sort}&productType=${productType}&ageGroup=${ageGroup}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg ? errorMsg.message : errorMsg);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const getOrders = async ({
  status,
  mobile,
  page = 1,
  limit = 50,
}: {
  status?: string;
  mobile?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> => {
  try {
    const res = await fetch(
      `${BASE_URL}/order?limit=${limit}&page=${page}&status=${status}&mobile=${mobile}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg ? errorMsg.message : errorMsg);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const getUserOrders = async (): Promise<OrdersResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/order/user`, {
      credentials: "include",
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
export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<OrdersResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      credentials: "include",
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

export const bulkUpdateOrderStatus = async ({
  orderIds,
  status,
}: {
  orderIds: string[];
  status: string;
}): Promise<{ message: string; modifiedCount: number }> => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderIds, status }),
      credentials: "include",
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

export const bulkDeleteOrders = async ({
  orderIds,
}: {
  orderIds: string[];
}): Promise<{ message: string; deletedCount: number }> => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderIds }),
      credentials: "include",
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
export const getProductDetails = async (
  slug: string,
): Promise<ProductDetailsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/products/${slug}`, {
      credentials: "include",
      next: {
        revalidate: 60,
      },
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

export const getRelatedProducts = async (
  slug: string,
): Promise<IRelatedProductsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/products/related/${slug}`, {
      next: { revalidate: 60 },
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

export const getCartDataClient = async (): Promise<CartResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      credentials: "include",
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
export const addItemToCart = async ({
  item,
}: {
  item: {
    productId: string;
    sku: string;
    quantity: string | number;
    size: { _id?: string; size: string; range?: string };
    color: { _id?: string; name: string; hexCode: string };
  };
}): Promise<CartResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      credentials: "include",
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
export const updateCartItemQuantity = async ({
  sku,
  quantity,
}: {
  quantity: string | number;
  sku: string;
}): Promise<CartResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sku,
        quantity,
      }),
      credentials: "include",
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
export const deleteCartItem = async ({
  sku,
}: {
  sku: string;
}): Promise<CartResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${sku}`, {
      method: "DELETE",
      credentials: "include",
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
// TODO: add the ts response
export const toggleWishlist = async ({
  product_id,
}: {
  product_id: string;
}): Promise<IWishlistRes> => {
  try {
    const res = await fetch(`${BASE_URL}/wishlist/${product_id}`, {
      method: "POST",
      credentials: "include",
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

// TODO: handle get wishlist
export const getWishlist = async (): Promise<IWishlistRes> => {
  try {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      credentials: "include",
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

export const getSettingsData = async (): Promise<SettingsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/setting`, {
      credentials: "include",
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

export const updateSettings = async (body: {
  season: string;
  banner: {
    base64: string;
  };
  category: string[];
  fabric: string[];
  sizeDescription: SizeDescription[];
  shippingRates: Record<string, number>;
}): Promise<SettingsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/setting/Updatesetting`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
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

export const checkout = async ({
  shipping,
}: {
  shipping: {
    name: string;
    phone: string;
    address: string;
    building: string;
    city: string;
    governorate: string;
    email?: string;
    note?: string;
  };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ shipping }),
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
export const buyNow = async ({
  productId,
  sku,
  quantity,
  size,
  color,
  shipping,
}: {
  productId: string;
  sku: string;
  quantity: number;
  size: {
    size: string;
    range?: string;
  };
  color: {
    name: string;
    hexCode: string;
  };
  shipping: {
    name: string;
    phone: string;
    phone2?: string;
    address: string;
    building: string;
    city: string;
    governorate: string;
    email?: string;
    note?: string;
  };
}) => {
  try {
    const res = await fetch(`${BASE_URL}/order/buyNow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ shipping, productId, sku, quantity, size, color }),
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      throw new Error(errorMsg.message);
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
