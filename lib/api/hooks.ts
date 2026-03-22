"use client";
import { IProductRes, IWishlistRes } from "@/types/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  addItemToCart,
  addOrUpdateOffer,
  addProduct,
  buyNow,
  checkout,
  currentUser,
  deleteCartItem,
  deleteProduct,
  getCartDataClient,
  getOperationRoleUsers,
  getOrders,
  getProductDetails,
  getProducts,
  getSettingsData,
  getUserOrders,
  getWishlist,
  logout,
  signin,
  signup,
  toggleAvilability,
  toggleUserRole,
  toggleWishlist,
  updateCartItemQuantity,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  bulkDeleteOrders,
  updateProduct,
  updateSettings,
} from ".";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: currentUser,
    retry: false,
  });
};
export const useSignin = () => {
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: signin,
  });
};
export const useSignup = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
  });
};
export const useLogout = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSettled: () => {
      queyrClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProduct,
  });
};

export const useDeleteProduct = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProduct,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useAddOrUpdateOffer = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["addOrUpdateOffer"],
    mutationFn: addOrUpdateOffer,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useToggleAvilability = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["toggleAvilability"],
    mutationFn: toggleAvilability,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useProducts = ({
  q = "",
  page = 1,
  limit = 10,
  category = "",
  fabric = "",
  season = "",
  minPrice = "",
  maxPrice = "",
  color = "",
  size = "",
  sort = "",
  isAvailable = "",
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
  isAvailable?: boolean | "";
  sort?: string;
}) => {
  return useQuery({
    queryKey: [
      "products",
      {
        q,
        page,
        limit,
        category,
        fabric,
        season,
        minPrice,
        maxPrice,
        color,
        size,
        sort,
        isAvailable,
      },
    ],
    queryFn: () =>
      getProducts({
        q,
        page,
        limit,
        category,
        fabric,
        season,
        minPrice,
        maxPrice,
        color,
        size,
        sort,
        isAvailable,
      }),
  });
};
export const useOrders = ({
  status = "",
  mobile = "",
  page = 1,
  limit = 50,
}: {
  status?: string;
  mobile?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["orders", { status, mobile, page, limit }],
    queryFn: () => getOrders({ status, mobile, page, limit }),
  });
};
export const useUserOrders = () => {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: getUserOrders,
  });
};
export const useUpdateOrderStatus = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateOrderStatus"],
    mutationFn: updateOrderStatus,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useBulkUpdateOrderStatus = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["bulkUpdateOrderStatus"],
    mutationFn: bulkUpdateOrderStatus,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useBulkDeleteOrders = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["bulkDeleteOrders"],
    mutationFn: bulkDeleteOrders,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ["singleProduct", slug],
    queryFn: () => getProductDetails(slug),
  });
};
export const useUpdateProduct = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProduct,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["products"] });
      queyrClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartDataClient,
  });
};

export const useAddToCart = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["addToCart"],
    mutationFn: addItemToCart,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartProductQuantity = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCart"],
    mutationFn: updateCartItemQuantity,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
export const useDeleteCartProduct = () => {
  const queyrClient = useQueryClient();
  return useMutation({
    mutationKey: ["removeCartItem"],
    mutationFn: deleteCartItem,
    onSettled() {
      queyrClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
// TODO: implement wishlist page to display the list of wishlist products
export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });
};
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWishlist,

    // ✅ OPTIMISTIC UPDATE (FOR YOUR SHAPE)
    onMutate: async ({ product_id }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist = queryClient.getQueryData<IWishlistRes>([
        "wishlist",
      ]);

      queryClient.setQueryData<IWishlistRes>(["wishlist"], (old) => {
        if (!old) return old;

        const exists = old.wishlist.products.some(
          (product) => product._id === product_id,
        );

        return {
          ...old,
          wishlist: {
            ...old.wishlist,
            products: exists
              ? old.wishlist.products.filter(
                  (product) => product._id !== product_id,
                )
              : [
                  ...old.wishlist.products,
                  // 🔴 TEMP PLACEHOLDER PRODUCT
                  // This will be replaced after refetch
                  { _id: product_id } as IProductRes,
                ],
          },
        };
      });

      return { previousWishlist };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettingsData,
  });
};
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSettings"],
    mutationFn: updateSettings,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["checkout"],
    mutationFn: checkout,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};

export const useBuyNow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["buyNow"],
    mutationFn: buyNow,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};

export const useOpeartionRoleUsers = () => {
  return useQuery({
    queryKey: ["opeartionUsers"],
    queryFn: getOperationRoleUsers,
  });
};
export const useToggleUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["toggleUser"],
    mutationFn: toggleUserRole,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["opeartionUsers"] });
    },
  });
};

export function useUpdateQuery({
  targetURL = "store",
}: {
  targetURL?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (params: Record<string, string | number | null>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (!value) current.delete(key);
      else current.set(key, String(value));
    });

    startTransition(() => {
      router.push(`/${targetURL}?${current.toString()}`);
    });
  };

  const resetOne = (key: string) => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete(key);
    startTransition(() => {
      router.push(`/${targetURL}?${current.toString()}`);
    });
  };

  const resetAll = () => {
    const params = new URLSearchParams();

    // keep limit if you want
    if (searchParams.get("limit")) {
      params.set("limit", searchParams.get("limit")!);
    }

    startTransition(() => {
      router.push(`/${targetURL}?${params.toString()}`);
    });
  };

  return { update, resetOne, resetAll, isPending };
}

// export const useToggleWishlist = () => {
//   const queyrClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["toggleWishlist"],
//     mutationFn: toggleWishlist,
//     onSettled() {
//       queyrClient.invalidateQueries({ queryKey: ["wishlist"] });
//       queyrClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };
