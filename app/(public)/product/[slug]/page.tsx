import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductInfo } from "../../_components/product-details/product-info";
import { ProductFeatures } from "../../_components/product-details/product-features";
import { ProductPerformance } from "../../_components/product-details/product-performance";
import { RecommendedProducts } from "../../_components/product-details/recommended-products";
import { ReviewsModal } from "../../_components/product-details/reviews-modal";

import { API_ORIGIN } from '@/lib/config/api';

/**
 * A missing product and an unreachable backend must not look the same. The backend
 * answering 404 is the only proof the product does not exist; a timeout, a 502, or a
 * socket reset says nothing about the product and must not render "Product Not Found".
 */
class ProductFetchError extends Error {}

const PRODUCT_FETCH_TIMEOUT_MS = 8000;
const PRODUCT_FETCH_ATTEMPTS = 3;

async function fetchProductOnce(slug: string) {
  const fullUrl = `${API_ORIGIN}/api/catalog/products/${slug}`;

  const res = await fetch(fullUrl, {
    // Product data changes with stock/price, so it is never served stale, but the two
    // callers below (generateMetadata + the page) must share one request per render.
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(PRODUCT_FETCH_TIMEOUT_MS),
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new ProductFetchError(`Backend returned ${res.status} for ${slug}`);
  }

  const data = await res.json();
  return data.success ? data.data : null;
}

/**
 * Three outcomes, deliberately distinct:
 *   { status: 'found' }     - the product exists
 *   { status: 'missing' }   - the backend confirmed 404; only this may render not-found
 *   { status: 'unreachable' } - transient failure; says nothing about the product
 */
type ProductResult =
  | { status: 'found'; product: any }
  | { status: 'missing' }
  | { status: 'unreachable'; error: unknown };

async function getProduct(slug: string): Promise<ProductResult> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= PRODUCT_FETCH_ATTEMPTS; attempt++) {
    try {
      const product = await fetchProductOnce(slug);
      return product ? { status: 'found', product } : { status: 'missing' };
    } catch (error) {
      lastError = error;
      console.error(`Product fetch attempt ${attempt}/${PRODUCT_FETCH_ATTEMPTS} failed for "${slug}":`, error);

      if (attempt < PRODUCT_FETCH_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  }

  return { status: 'unreachable', error: lastError };
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // In Next.js 15, params is always a Promise and must be awaited
  const { slug } = await params;

  // Metadata runs outside the route's error boundary, so it must never throw --
  // an error here fails the whole render as a 500 before error.tsx can catch it.
  const result = await getProduct(slug);

  // Only a confirmed 404 may claim the product does not exist. When the backend is
  // simply unreachable, stay neutral; the page body below decides what to render.
  if (result.status === 'missing') {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  if (result.status === 'unreachable') {
    return { title: 'Shah Sports' };
  }

  const product = result.product;

  const apiUrl = API_ORIGIN;
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
      'product:price:currency': 'BDT',
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

  const result = await getProduct(slug);

  // Only a confirmed 404 is a real "does not exist". A backend blip is retryable and
  // must reach error.tsx instead of being reported as a missing product.
  if (result.status === 'missing') {
    notFound();
  }

  if (result.status === 'unreachable') {
    throw new ProductFetchError(
      `Could not load product "${slug}" after ${PRODUCT_FETCH_ATTEMPTS} attempts: ${result.error}`
    );
  }

  const product = result.product;

  const apiUrl = API_ORIGIN;
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
              priceCurrency: 'BDT',
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
      <ReviewsModal product={product} />
    </div>
  );
}
      

