import { Skeleton } from "./ui/skeleton";
import * as motion from "motion/react-client";
const CardsListSkeleton = () => {
  return (
    <>
      <Skeleton className="h-12 rounded-lg bg-gray-200" />
      <div className="grid grid-cols-2 xl:grid-cols-4 max-sm:gap-x-2 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <motion.div
            initial={{ y: -20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            key={idx}
            className="space-y-3 pb-5 bg-white border"
          >
            <Skeleton className="h-[250px] rounded-none bg-gray-200 sm:h-[400px]" />
            <Skeleton className="h-3 mx-auto bg-gray-200 w-[80%]" />
            <Skeleton className="h-3 mx-auto bg-gray-200 w-[60%]" />
            <Skeleton className="h-10 mx-auto bg-gray-200 rounded-lg w-[90%]" />
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default CardsListSkeleton;
