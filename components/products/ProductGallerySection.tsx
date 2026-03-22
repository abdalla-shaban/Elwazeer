"use client";

import { useState } from "react";
import { Product, Color } from "@/types/productDetails";
import Image from "next/image";
import { LuBadgePercent } from "react-icons/lu";
import ProductDetailsFormActions from "@/components/products/ProductDetailsFormActions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ProductGallerySection = ({ productData }: { productData: Product }) => {
  // Aggregate all unique images with color context
  const allImages = [
    ...(productData.colors?.flatMap(
      (color) => color.images?.map((img) => ({ ...img, color })) || [],
    ) || []),
  ];

  // Initialize selected color to the first available color
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    productData.colors?.[0] || null,
  );

  // Initialize main image to the first image in the collection
  const [mainImage, setMainImage] = useState<string>(
    allImages[0]?.secure_url || "/demo.jpg",
  );

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);
    // When color changes, optionally switch to its first image
    if (color.images?.[0]?.secure_url) {
      setMainImage(color.images[0].secure_url);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* LEFT: IMAGE GALLERY (7 columns) */}
      <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
        {/* Main Image Display */}
        <div className="flex-1 relative aspect-4/5 rounded-[2.5rem] overflow-hidden bg-muted/20 border shadow-sm group">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Image
                src={mainImage}
                alt={productData.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Discount Badge */}
          {productData.offer.isAvailable && productData.offer.percent > 0 && (
            <div className="absolute top-6 right-6 z-10 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce">
              <LuBadgePercent className="text-xl" />
              <span>%{productData.offer.percent} خصم</span>
            </div>
          )}
        </div>

        {/* Vertical Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 px-1 max-h-[500px]">
          {allImages.map((img, idx) => (
            <button
              key={img._id || idx}
              onClick={() => {
                setMainImage(img.secure_url);
                if (img.color) setSelectedColor(img.color);
              }}
              className={cn(
                "relative size-20 md:size-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 shrink-0",
                mainImage === img.secure_url
                  ? "border-primary ring-2 ring-primary/20 scale-105 shadow-md"
                  : "border-transparent hover:border-primary/40 hover:scale-105",
              )}
            >
              <Image
                src={img.secure_url}
                alt={`Thumbnail ${idx}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          {allImages.length === 0 && (
            <div className="relative size-20 md:size-24 rounded-2xl overflow-hidden border-2 border-primary shadow-md">
              <Image
                src="/demo.jpg"
                alt="Default Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: PRODUCT INFO (5 columns) */}
      <div className="lg:col-span-5 flex flex-col justify-start space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            {productData.name}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            {productData.metaDescription}
          </p>
        </div>

        <div className="flex items-baseline gap-4">
          <div className="text-4xl font-black text-primary">
            {productData.finalPrice}{" "}
            <span className="text-2xl font-bold">جنية مصري</span>
          </div>
          {productData.offer.isAvailable && productData.offer.percent > 0 && (
            <div className="text-2xl text-slate-400 line-through font-medium">
              {productData.price} ج.م
            </div>
          )}
        </div>

        <ProductDetailsFormActions
          item={productData}
          colors={productData.colors}
          productId={productData._id}
          onColorChange={handleColorChange}
          selectedColor={selectedColor}
        />
      </div>
    </div>
  );
};

export default ProductGallerySection;
