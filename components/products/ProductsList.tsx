import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
// TODO: hanlde server side loading
const ProductsList = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    limit: number;
    category: string;
    fabric: string;
    season: string;
    minPrice: number;
    maxPrice: number;
    color: string;
    size: string;
    range: string;
    q: string;
    sort: string;
  }>;
}) => {
  const data = await getProducts({
    q: (await searchParams).q || "",
    page: (await searchParams).page,
    isAvailable: "true",
  });
  return (
    <section className="space-y-5">
      {data.data.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-x-2 gap-5 pb-10">
          {data.data.map((item, idx) => (
            <ProductCard key={item._id} item={item} index={idx} />
          ))}
        </div>
      ) : (
        <div className="p-5 flex flex-col gap-5 justify-center items-center bg-white rounded-xl shadow border">
          <h2>
            لا يوجد منتجات{" "}
            <span className="text-red-600">{(await searchParams).q}</span>
          </h2>
          <Image
            src={"/emptyproducts.svg"}
            alt="Empty Products"
            width={300}
            height={300}
            className="size-60"
          />
        </div>
      )}

      <div className="text-center pb-5">
        <Button
          className="text-primary text-lg font-semibold"
          asChild
          size={"lg"}
          variant={"secondary"}
        >
          <Link href={"/store"}>استكشف المزيد</Link>
        </Button>
      </div>
    </section>
  );
};

export default ProductsList;
