import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductInfo } from "../../_components/product-details/product-info";
import { ProductFeatures } from "../../_components/product-details/product-features";
import { ProductPerformance } from "../../_components/product-details/product-performance";
import { RecommendedProducts } from "../../_components/product-details/recommended-products";

// Fetch product data for metadata and page
async function getProduct(slug: string) {
  try {
    // Backend API URL from environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const fullUrl = `${apiUrl}/api/catalog/products/${slug}`;
    
    console.log('Fetching product from:', fullUrl);
    
    const res = await fetch(fullUrl, {
      cache: 'no-store', // Always fetch fresh data for product details
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log('Product data received:', data.success ? 'Success' : 'Failed');
    
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // In Next.js 15, params is always a Promise and must be awaited
  const { slug } = await params;
  
  console.log('generateMetadata - slug:', slug);
  
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
  const imageUrl = primaryImage?.full_url 
    ? `${apiUrl}${primaryImage.full_url}`
    : undefined;

  const price = parseFloat(product.price);
  const comparePrice = product.compare_price ? parseFloat(product.compare_price) : null;

  return {
    title: product.meta_title || `${product.name} | Shah Sports`,
    description: product.meta_description || product.short_description || product.description?.substring(0, 160),
    keywords: product.meta_keywords,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description?.substring(0, 160),
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: 'website',
      siteName: 'Shah Sports',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description || product.description?.substring(0, 160),
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'USD',
      ...(comparePrice && { 'product:price:standard_amount': comparePrice.toString() }),
      'product:availability': product.stock_status === 'in_stock' ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand?.name || '',
      'product:category': product.category?.name || '',
    },
  };
}

export default async function ProductDetailsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // In Next.js 15, params is always a Promise and must be awaited
  const { slug } = await params;
  
  console.log('ProductDetailsPage - slug:', slug);
  
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <div className="flex flex-col bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.short_description || product.description,
            image: product.images?.map((img: any) => 
              `${apiUrl}${img.full_url}`
            ) || [],
            sku: product.sku,
            brand: {
              '@type': 'Brand',
              name: product.brand?.name || 'Shah Sports',
            },
            offers: {
              '@type': 'Offer',
              url: `${siteUrl}/product/${product.slug}`,
              priceCurrency: 'USD',
              price: parseFloat(product.price),
              priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              availability: product.stock_status === 'in_stock' 
                ? 'https://schema.org/InStock' 
                : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
            },
            aggregateRating: product.review_count > 0 ? {
              '@type': 'AggregateRating',
              ratingValue: product.average_rating || 5,
              reviewCount: product.review_count || 0,
              bestRating: 5,
              worstRating: 1,
            } : undefined,
            category: product.category?.name,
          }),
        }}
      />
      
      <ProductInfo product={product} />
      <ProductFeatures product={product} />
      <ProductPerformance product={product} />
      <RecommendedProducts currentProductId={product.id} categoryId={product.category_id} />
    </div>
  );
}
      

