"use client";
import { useUpdateQuery } from "@/lib/api/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";

const SortList = () => {
  const { update, resetOne, isPending } = useUpdateQuery({});
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "recent";
  return (
    <div className="flex items-center gap-4">
      <Select
        value={currentSort}
        onValueChange={(value) => {
          if (value === "recent") {
            resetOne("sort");
          } else {
            update({ sort: value });
          }
        }}
        dir="rtl"
      >
        <SelectTrigger disabled={isPending} className="max-w-sm md:min-w-2xs bg-white w-full">
          <SelectValue placeholder="الترتيب حسب" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          <SelectItem value="recent">الأحدث</SelectItem>
          <SelectItem value="price_asc">اقل سعر - اعلى سعر</SelectItem>
          <SelectItem value="price_desc">اعلى سعر - اقل سعر</SelectItem>
        </SelectContent>
      </Select>
      <Button disabled={isPending} variant={"outline"} onClick={() => resetOne("sort")}>
        <RotateCcw />
        <span className="max-md:hidden">إزالة الترتيب</span>
      </Button>
    </div>
  );
};

export default SortList;
