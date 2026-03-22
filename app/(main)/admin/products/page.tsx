import { ProductsTable } from "@/components/tables/ProductsTable";
import { Card, CardContent } from "@/components/ui/card";

const ProductsPage = () => {
  return (
    <Card className="w-full overflow-x-auto">
      <CardContent>
        <ProductsTable />
      </CardContent>
    </Card>
  );
};

export default ProductsPage;
