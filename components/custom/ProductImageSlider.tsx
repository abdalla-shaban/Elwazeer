"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProductDetailsImage } from "@/types/productDetails";
import Image from "next/image";

export function ProductImageSlider({
  images,
  product,
  selectedColor,
  onSlideChange,
}: {
  product: string;
  images: ProductDetailsImage[];
  selectedColor?: string;
  onSlideChange?: (index: number) => void;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrent(index + 1);
      if (onSlideChange) {
        onSlideChange(index);
      }
    });
  }, [api, onSlideChange]);

  React.useEffect(() => {
    if (api && selectedColor) {
      const colorIndex = images.findIndex(
        (img) => img.color?.hexCode === selectedColor,
      );
      if (colorIndex !== -1) {
        api.scrollTo(colorIndex);
      }
    }
  }, [api, selectedColor, images]);

  return (
    <div className="space-y-4">
      <Carousel opts={{ direction: "rtl" }} setApi={setApi} className="w-full">
        <CarouselContent>
          {images?.map(({ public_id, secure_url }) => (
            <CarouselItem key={public_id}>
              <Image
                src={secure_url}
                alt={product}
                width={500}
                height={500}
                className="h-full max-h-[500px] object-contain object-center mx-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {images?.map(({ secure_url, public_id }, idx) => (
          <div
            onClick={() => {
              if (idx + 1 === current) return;
              api?.scrollTo(idx);
            }}
            key={public_id}
            tabIndex={-1}
            className={`cursor-pointer relative border-4 duration-300 size-20 overflow-hidden rounded-md ${
              idx + 1 === current ? "border-primary" : ""
            }`}
          >
            <Image
              src={secure_url}
              alt="Image"
              fill
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
