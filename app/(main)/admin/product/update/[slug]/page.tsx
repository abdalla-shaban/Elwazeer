import UpdateProductForm from "@/components/products/forms/UpdateProductForm";

const AddProductPage = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await params;

  return (
    <section className="flex-1 w-full">
      <UpdateProductForm slug={slug} />
    </section>
  );
};

export default AddProductPage;
