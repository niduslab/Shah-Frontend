interface ProductFeaturesProps {
  product: any;
}

export function ProductFeatures({ product }: ProductFeaturesProps) {
  // Only show this section if product has features or is featured
  if (!product.is_featured && !product.description) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex flex-col gap-24">
          
          {/* Main Feature Section */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[550px] w-full max-w-[630px] overflow-hidden rounded-[2px] bg-gray-100">
              {product.images && product.images.length > 1 ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${product.images[1].full_url}`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold leading-tight text-black md:text-4xl">
                {product.name}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description || product.short_description || 'Premium quality product designed for your needs.'}
              </p>
              
              {product.brand && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Brand</p>
                  <p className="text-lg font-medium text-black">{product.brand.name}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
