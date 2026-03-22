import { OrdersTable } from "@/components/tables/OrdersTable";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

const OrdersPage = () => {
  return (
    <Card className="w-full overflow-x-auto">
      <CardContent>
        <Suspense fallback={null}>
          <OrdersTable />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default OrdersPage;
