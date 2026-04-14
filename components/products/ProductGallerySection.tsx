"use client";

import ProductDetailsFormActions from "@/components/products/ProductDetailsFormActions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color, Product, ProductDetailsImage } from "@/types/productDetails";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { LuArrowRight, LuBadgePercent, LuPackageX } from "react-icons/lu";

interface GalleryImage extends ProductDetailsImage {
  color?: Color | null;
}

const ProductGallerySection = ({ productData }: { productData: Product }) => {
  const allColors = productData.colors || [];
  
  // Filter only available colors
  const availableColors = useMemo(
    () => allColors.filter((color) => color.isAvailable),
    [allColors],
  );

  // Synchronized state for components
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    availableColors?.[0] || null,
  );

  const initialImage = useMemo(() => {
    return (
      availableColors?.[0]?.images?.[0]?.secure_url ||
      "/demo.jpg"
    );
  }, [availableColors]);

  const [mainImage, setMainImage] = useState<string>(initialImage);

  // Aggregate all unique images with color context
  const allImages = useMemo(() => {
    const images: GalleryImage[] = [];

    allColors.forEach((color) => {
      color.images?.forEach((img) => {
        const exists = images.some((i) => i.secure_url === img.secure_url);
        if (!exists) {
          images.push({ ...img, color });
        }
      });
    });

    return images;
  }, [allColors]);

  const handleColorChange = useCallback((color: Color) => {
    if (!color.isAvailable) return;

    setSelectedColor(color);
    if (color.images?.[0]?.secure_url) {
      setMainImage(color.images[0].secure_url);
    }
  }, []);

  const handleThumbnailClick = (img: GalleryImage) => {
    setMainImage(img.secure_url);
    if (img.color && img.color.isAvailable) {
      setSelectedColor(img.color);
    }
  };

  if (!productData.isAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 p-8 md:p-16 text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white p-8 rounded-4xl shadow-2xl shadow-primary/10 border border-primary/5">
            <LuPackageX className="size-20 text-primary/40" />
          </div>
        </div>
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            عذراً، هذا المنتج غير متوفر حالياً
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            نعتذر لعدم توفر هذا المنتج في الوقت الحالي. نحن نعمل على توفيره في
            أقرب وقت ممكن. يمكنك اكتشاف أحدث تشكيلاتنا المتاحة الآن.
          </p>
        </div>
        <Link href="/shop">
          <Button
            size="lg"
            className="h-16 px-10 rounded-2xl text-xl font-black gap-3 shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            تصفح المتجر
            <LuArrowRight className="size-6 rotate-180" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      {/* LEFT: IMAGE GALLERY (7 columns) */}
      <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-6">
        {/* Main Image Display */}
        <div className="flex-1 relative aspect-4/5 rounded-4xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImage}
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-full h-full"
            >
              <Image
                src={mainImage}
                alt={productData.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Discount Badge */}
          {productData.offer.isAvailable && productData.offer.percent > 0 && (
            <div className="absolute top-6 right-6 z-10 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl flex items-center gap-2 animate-bounce">
              <LuBadgePercent className="text-xl" />
              <span className="text-lg">%{productData.offer.percent} خصم</span>
            </div>
          )}
        </div>

        {/* Vertical Thumbnails */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 px-1 max-h-[600px] scroll-smooth">
          {allImages.map((img, idx) => (
            <button
              key={img._id || `${img.secure_url}-${idx}`}
              onClick={() => handleThumbnailClick(img)}
              className={cn(
                "relative size-20 md:size-28 rounded-2xl overflow-hidden border-2 transition-all duration-500 shrink-0",
                mainImage === img.secure_url
                  ? "border-primary ring-4 ring-primary/10 scale-105 shadow-lg z-10"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-primary/30 hover:scale-105",
              )}
            >
              <Image
                src={img.secure_url}
                alt={`${productData.name} - Thumbnail ${idx}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 112px"
              />
            </button>
          ))}
          {allImages.length === 0 && (
            <div className="relative size-20 md:size-28 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50">
              <Image
                src="/demo.jpg"
                alt="Placeholder"
                fill
                className="object-cover opacity-50 grayscale"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: PRODUCT INFO (5 columns) */}
      <div className="lg:col-span-5 flex flex-col justify-start space-y-10 py-4 animate-in fade-in slide-in-from-left-12 duration-1000">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold tracking-wider uppercase">
            {productData.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            {productData.name}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {productData.metaDescription}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-slate-400 font-bold uppercase mb-1">
              السعر الحالي
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary">
                {productData.finalPrice}
              </span>
              <span className="text-xl font-bold text-slate-700">
                جنية مصري
              </span>
            </div>
          </div>
          {productData.offer.isAvailable && productData.offer.percent > 0 && (
            <div className="flex flex-col pt-6">
              <span className="text-2xl text-slate-300 line-through font-bold decoration-red-500/30">
                {productData.price} ج.م
              </span>
            </div>
          )}
        </div>

        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <ProductDetailsFormActions
            item={productData}
            colors={allColors}
            productId={productData._id}
            onColorChange={handleColorChange}
            selectedColor={selectedColor}
          />
        </div>

        {/* Features minimal indicators */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-bold">متوفر في المخزون</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-sm font-bold">شحن سريع</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallerySection;
