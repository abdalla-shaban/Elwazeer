"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useSettings, useUpdateQuery } from "@/lib/api/hooks";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BiCollapseVertical } from "react-icons/bi";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const FilterSheet = () => {
  const [opeSheet, setOpenSheet] = useState<boolean>(false);
  const params = useSearchParams();
  const { data: settingsData } = useSettings();

  const { update, resetOne, resetAll, isPending } = useUpdateQuery({});
  return (
    <Sheet open={opeSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button disabled={isPending}>
          فلتر
          <SlidersHorizontal />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-5 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>الفلتر</SheetTitle>
        </SheetHeader>
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex cursor-pointer items-center gap-2 justify-between w-full hover:bg-gray-200 bg-gray-100 duration-200 rounded-md p-3 mb-3">
            الأقسام
            <BiCollapseVertical />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-2">
              {settingsData?.settings.category.map((cat, idx) => (
                <li key={idx}>
                    <Button
                      disabled={isPending}
                      onClick={() => {
                        update({ category: cat });
                        setOpenSheet(false);
                      }}
                      variant={
                        params.has("category", cat) ? "default" : "outline"
                      }
                    >
                    {cat}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              className="mt-3"
              variant={"outline"}
              disabled={isPending}
              onClick={() => resetOne("category")}
            >
              إزالة الفلتر
            </Button>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible>
          <CollapsibleTrigger className="flex cursor-pointer items-center gap-2 justify-between w-full hover:bg-gray-200 bg-gray-100 duration-200 rounded-md p-3 mb-3">
            الخامات <BiCollapseVertical />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-2">
              {settingsData?.settings.fabric.map((cat, idx) => (
                <li key={idx}>
                  <Button
                    disabled={isPending}
                    onClick={() => {
                      update({ fabric: cat });
                      setOpenSheet(false);
                    }}
                    variant={params.has("fabric", cat) ? "default" : "outline"}
                  >
                    {cat}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              className="mt-3"
              variant={"outline"}
              disabled={isPending}
              onClick={() => resetOne("fabric")}
            >
              إزالة الفلتر
            </Button>
          </CollapsibleContent>
        </Collapsible>
        <Separator />
        <Collapsible>
          <CollapsibleTrigger className="flex cursor-pointer items-center gap-2 justify-between w-full hover:bg-gray-200 bg-gray-100 duration-200 rounded-md p-3 mb-3">
            المقاسات <BiCollapseVertical />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <RadioGroup
              dir="rtl"
              disabled={isPending}
              onValueChange={(e) => {
                update({ size: e });
                setOpenSheet(false);
              }}
            >
              {settingsData?.settings.sizeDescription.map((size, idx) => (
                <div className="flex items-center gap-3" key={idx}>
                  <RadioGroupItem id={`filterSize-${idx}`} value={size.size} />
                  <Label
                    className="flex items-center gap-3"
                    key={idx}
                    htmlFor={`filterSize-${idx}`}
                  >
                    <span>{size.size}</span>
                    <span>{size.range}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {/* <SizesFilter /> */}
            <Button
              className="mt-3"
              variant={"outline"}
              disabled={isPending}
              onClick={() => resetOne("size")}
            >
              إزالة الفلتر
            </Button>
          </CollapsibleContent>
        </Collapsible>
        <Button
          className="mt-5"
          variant={"outline"}
          disabled={isPending}
          onClick={() => {
            resetAll();
            setOpenSheet(false);
          }}
        >
          إزالة الفلتر
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
