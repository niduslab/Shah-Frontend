interface ProductFeaturesProps {
  product: any;
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
  // Only show this section if product has description
  if (!product.description) {
    return null;
  }

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8">
        {/* Section Header - Centered */}
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            Product Details
          </h2>
          <div className="mt-3 mx-auto h-1 w-20 bg-primary rounded-full"></div>
        </div>

        {/* Rich Text Content - Full Width */}
        <div 
          className="w-full text-gray-600 product-description-content"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </section>
  );
}
