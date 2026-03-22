"use client";
import { useUpdateCartProductQuantity } from "@/lib/api/hooks";
import { Stock } from "@/types/cart";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const CartItemActions = ({
  quantity,
  sku,
  stock,
}: {
  stock: Stock;
  quantity: string | number;
  sku: string;
}) => {
  const [qValue, setQValue] = useState(quantity);
  const { mutate: updateQuantity, isPending: isUpdateQunatityPending } =
    useUpdateCartProductQuantity();
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="relative w-36">
        <Button
          variant={"outline"}
          className="absolute right-0"
          disabled={
            isUpdateQunatityPending || stock.manageStock
              ? +qValue >= stock.stockQuantity
              : isUpdateQunatityPending
          }
          onClick={() => {
            if (stock.manageStock && +qValue >= stock.stockQuantity) {
              setQValue(stock.stockQuantity);
            } else {
              updateQuantity({ quantity: +quantity + 1, sku });
              setQValue(+quantity + 1);
            }
          }}
        >
          +
        </Button>
        <Button
          variant={"outline"}
          className="absolute left-0"
          disabled={isUpdateQunatityPending || qValue === 1}
          onClick={() => {
            updateQuantity({ quantity: +quantity - 1, sku });
            setQValue(+quantity - 1);
          }}
        >
          -
        </Button>
        <Input
          type="number"
          value={qValue}
          disabled={isUpdateQunatityPending}
          onChange={(e) => setQValue(e.target.value)}
          onBlur={(e) => {
            if (+e.target.value < 1) {
              e.target.value = "1";
              setQValue(1);
            }
            if (stock.manageStock && +qValue >= stock.stockQuantity) {
              setQValue(stock.stockQuantity);
            } else {
              if (+e.target.value !== +quantity) {
                updateQuantity({ quantity: e.target.value, sku });
                setQValue(e.target.value);
              }
            }
          }}
          className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
};

export default CartItemActions;
