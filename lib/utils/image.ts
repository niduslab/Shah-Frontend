/**
 * Get the full URL for an image stored on the backend
 * @param path - The relative path from the backend (e.g., "brands/logo.png")
 * @returns Full URL to the image
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct full URL - backend serves storage files at /storage/{path}
  return `${apiUrl}/storage/${cleanPath}`;
}

/**
 * Get a placeholder image URL with optional text
 * @param text - Optional text to display in placeholder
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(text: string = 'No Image'): string {
  const encodedText = encodeURIComponent(text.slice(0, 20));
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E${encodedText}%3C/text%3E%3C/svg%3E`;
}

/**
 * Get the primary image URL from a product's images array
 * @param images - Array of product images
 * @returns URL of the primary image or placeholder
 */
export function getPrimaryImageUrl(images?: Array<{ image_path: string; is_primary: boolean }> | null): string {
  if (!images || images.length === 0) return getPlaceholderImage();
  
  const primaryImage = images.find(img => img.is_primary);
  const imageToUse = primaryImage || images[0];
  
  return getImageUrl(imageToUse.image_path);
}

/**
 * Get all image URLs from a product's images array
 * @param images - Array of product images
 * @returns Array of full image URLs
 */
export function getAllImageUrls(images?: Array<{ image_path: string }> | null): string[] {
  if (!images || images.length === 0) return [];
  
  return images.map(img => getImageUrl(img.image_path));
}
