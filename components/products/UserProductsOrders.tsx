import Image from "next/image";
import { Fragment } from "react/jsx-runtime";
import { Badge } from "../ui/badge";
import Link from "next/link";
const UserProductsOrders = () => {
  return (
    <></>
    // <div className="pt-5 space-y-5">
    //   {order.items.map((item) => (
    //     <Fragment key={item._id}>
    //       <div className="flex flex-col sm:flex-row sm:items-start smLjustify-between gap-4">
    //         <div className="flex sm:items-center gap-4 flex-1">
    //           {/* IMAGE */}
    //           <div className="relative">
    //             <Image
    //               src={item.productId.images[0].secure_url}
    //               alt={item.productId.name}
    //               width={80}
    //               height={80}
    //               className="size-16 rounded-md object-cover object-top"
    //             />
    //             <Badge className="absolute top-0 translate-x-1/2">
    //               {item.quantity}
    //             </Badge>
    //           </div>
    //           {/* DETAILS */}
    //           <div className="space-y-1 text-right">
    //             <h4>
    //               <Link href={`/product/${item.productId.slug}`}>
    //                 {item.productId.name}
    //               </Link>
    //             </h4>
    //             <p className="text-sm text-gray-600">
    //               <span>{item.size.size}</span> <span>{item.size.range}</span>
    //             </p>
    //             <div className="flex sm:items-center gap-2">
    //               <div
    //                 className="size-4 rounded border"
    //                 style={{
    //                   backgroundColor: `${item.color[0].hexCode}`,
    //                 }}
    //               ></div>
    //               <p className="text-xs">{item.color[0].name}</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div>
    //           <p className="font-medium">
    //             {+item.productId.finalPrice * +item.quantity} EGP
    //           </p>
    //         </div>
    //       </div>
    //       <Separator />
    //     </Fragment>
    //   ))}
    //   <div className="space-y-3 mt-5">
    //     <div className="flex items-center justify-between">
    //       <h4>سعر الشحن</h4>
    //       <p className="font-medium">{order.shipping.shippingPrice} EGP</p>
    //     </div>
    //     <div className="flex items-center justify-between">
    //       <h4>إجمالي السعر</h4>
    //       <p className="font-medium">{order.totalPrice} EGP</p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default UserProductsOrders;
