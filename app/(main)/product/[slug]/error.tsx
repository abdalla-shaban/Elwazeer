"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RotateCcw } from "lucide-react";
import { MdError } from "react-icons/md";
const error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex bg-gray-200 items-center justify-center h-screen">
      <Empty className="border bg-white shadow border-solid max-w-xl">
        <EmptyHeader>
          <MdError className="text-red-700 text-5xl" />
          <EmptyTitle>حدث خطأ</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" onClick={reset}>
            إعادة المحاولة
            <RotateCcw />
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default error;
