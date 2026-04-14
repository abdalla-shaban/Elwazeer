import ProductGallerySection from "@/components/products/ProductGallerySection";
import RelatedProductsSlider from "@/components/products/RelatedProductsSlider";
import { getProductDetails, getRelatedProducts } from "@/lib/api";
import { IProductRes } from "@/types/products";
import { Metadata } from "next";
import * as motion from "motion/react-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: productData } = await getProductDetails(slug);

  return {
    title: productData.name,
    description: productData.metaDescription,
    keywords: productData.metaKeywords,
    alternates: {
      canonical: `https://wazeerstoreofficial.com/product/${slug}`,
    },
  };
}

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { data: productData } = await getProductDetails(slug);

  let relatedProducts: IProductRes[] = [];
  try {
    const { data } = await getRelatedProducts(slug);
    relatedProducts = data;
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-8 space-y-20"
    >
      <ProductGallerySection productData={productData} />

      {relatedProducts?.length > 0 && (
        <RelatedProductsSlider products={relatedProducts} />
      )}
    </motion.div>
  );
};

export default ProductDetails;
