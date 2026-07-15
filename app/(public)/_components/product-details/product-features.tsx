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

        {/* Rich Text Content - Full Width with CSS Isolation */}
        <style>
          {`
            .product-description-content {
              all: revert;
              max-width: 100%;
              overflow-x: auto;
            }

            .product-description-content * {
              max-width: 100%;
              box-sizing: border-box;
            }

            .product-description-content img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 1rem 0;
            }

            .product-description-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
              overflow-x: auto;
            }

            .product-description-content td,
            .product-description-content th {
              border: 1px solid #e5e7eb;
              padding: 0.75rem;
            }

            .product-description-content h1,
            .product-description-content h2,
            .product-description-content h3,
            .product-description-content h4,
            .product-description-content h5,
            .product-description-content h6 {
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              font-weight: 600;
              color: #111827;
            }

            .product-description-content h1 { font-size: 1.875rem; }
            .product-description-content h2 { font-size: 1.5rem; }
            .product-description-content h3 { font-size: 1.25rem; }

            .product-description-content p {
              margin-bottom: 0.75rem;
              line-height: 1.6;
              color: #374151;
            }

            .product-description-content ul,
            .product-description-content ol {
              margin: 1rem 0;
              padding-left: 1.5rem;
            }

            .product-description-content li {
              margin-bottom: 0.5rem;
            }

            .product-description-content a {
              color: #FF6F00;
              text-decoration: underline;
            }

            .product-description-content a:hover {
              color: #E65100;
            }

            .product-description-content code {
              background-color: #f3f4f6;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-family: monospace;
            }

            .product-description-content pre {
              background-color: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }

            .product-description-content blockquote {
              border-left: 4px solid #FF6F00;
              padding-left: 1rem;
              margin: 1rem 0;
              font-style: italic;
              color: #6b7280;
            }

            .product-description-content iframe {
              max-width: 100%;
              width: 100%;
              margin: 1rem 0;
            }

            .product-description-content svg {
              max-width: 100%;
              height: auto;
            }

            .product-description-content style,
            .product-description-content script {
              display: none;
            }
          `}
        </style>
        <div
          className="w-full text-gray-600 product-description-content"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </section>
  );
}
