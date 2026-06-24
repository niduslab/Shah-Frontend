import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ProductFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  status?: 'active' | 'inactive' | 'draft';
}

interface ProductData {
  category_id: number;
  brand_id: number;
  name: string;
  sku: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  quantity: number;
  low_stock_threshold?: number;
  weight?: number;
  weight_unit?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  status?: string;
  meta_title?: string;
  meta_description?: string;
}

interface VariationData {
  sku: string;
  price: number;
  quantity: number;
  attributes: Record<string, string>;
}

export const useAdminProducts = (filters?: ProductFilters, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

export const useAdminProduct = (id: number, options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/${id}`);
      return response.data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateProduct = (options?: UseMutationOptions<any, any, any>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.group('🔧 useCreateProduct - Processing Data');
      console.log('Input data:', data);
      
      // Check if data contains files
      const hasFiles = data.images?.some((img: any) => img.file instanceof File);
      console.log('Has file uploads:', hasFiles);
      
      if (hasFiles) {
        const formData = new FormData();
        
        // Add all product fields with proper type conversion
        Object.keys(data).forEach(key => {
          if (key !== 'images' && key !== 'variations' && data[key] !== undefined && data[key] !== null) {
            // Convert booleans to 1/0 for Laravel
            if (typeof data[key] === 'boolean') {
              formData.append(key, data[key] ? '1' : '0');
            } else {
              formData.append(key, String(data[key]));
            }
          }
        });
        
        // Add images
        if (data.images) {
          console.log('Processing images:', data.images.length);
          data.images.forEach((image: any, index: number) => {
            if (image.file) {
              formData.append(`images[${index}][file]`, image.file);
              formData.append(`images[${index}][path]`, 'temp');
              console.log(`Image ${index}: File upload - ${image.file.name}`);
            } else if (image.path) {
              formData.append(`images[${index}][path]`, image.path);
              console.log(`Image ${index}: Existing path - ${image.path}`);
            }
            formData.append(`images[${index}][alt_text]`, image.alt_text || '');
            formData.append(`images[${index}][is_primary]`, image.is_primary ? '1' : '0');
            formData.append(`images[${index}][sort_order]`, String(image.sort_order || index));
          });
        }

        // Add variations
        if (data.variations && Array.isArray(data.variations)) {
          console.log('Processing variations:', data.variations.length);
          data.variations.forEach((variation: any, index: number) => {
            if (variation.id) {
              formData.append(`variations[${index}][id]`, String(variation.id));
            }
            formData.append(`variations[${index}][sku]`, variation.sku);
            formData.append(`variations[${index}][price]`, String(variation.price));
            formData.append(`variations[${index}][quantity]`, String(variation.quantity));
            
            console.log(`Variation ${index}:`, {
              id: variation.id || 'NEW',
              sku: variation.sku,
              price: variation.price,
              quantity: variation.quantity,
              attributes: variation.attributes
            });
            
            // Add attributes as JSON string or individual fields
            if (variation.attributes && typeof variation.attributes === 'object') {
              Object.entries(variation.attributes).forEach(([key, value]) => {
                formData.append(`variations[${index}][attributes][${key}]`, String(value));
                console.log(`  - Attribute: ${key} = ${value}`);
              });
            }
            
            if (variation.sort_order !== undefined) {
              formData.append(`variations[${index}][sort_order]`, String(variation.sort_order));
            }
          });
        }

        // Add deleted variation IDs (for updates only)
        if (data.deleted_variation_ids && Array.isArray(data.deleted_variation_ids)) {
          console.log('Processing deleted variations:', data.deleted_variation_ids);
          data.deleted_variation_ids.forEach((id: number, index: number) => {
            formData.append(`deleted_variation_ids[${index}]`, String(id));
          });
        }
        
        console.log('Sending FormData to API...');
        console.groupEnd();
        
        const response = await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        console.log('Sending JSON data to API...');
        console.groupEnd();
        
        const response = await api.post('/api/admin/products', data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    ...options,
  });
};

export const useUpdateProduct = (options?: UseMutationOptions<any, any, { id: number; data: any }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.group('🔧 useUpdateProduct - Processing Data');
      console.log('Product ID:', id);
      console.log('Input data:', data);
      
      // Check if data contains files
      const hasFiles = data.images?.some((img: any) => img.file instanceof File);
      console.log('Has file uploads:', hasFiles);
      
      if (hasFiles) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        
        // Add all product fields with proper type conversion
        Object.keys(data).forEach(key => {
          if (key !== 'images' && key !== 'variations' && data[key] !== undefined && data[key] !== null) {
            // Convert booleans to 1/0 for Laravel
            if (typeof data[key] === 'boolean') {
              formData.append(key, data[key] ? '1' : '0');
            } else {
              formData.append(key, String(data[key]));
            }
          }
        });
        
        // Add images
        if (data.images) {
          console.log('Processing images:', data.images.length);
          data.images.forEach((image: any, index: number) => {
            if (image.file) {
              formData.append(`images[${index}][file]`, image.file);
              formData.append(`images[${index}][path]`, 'temp');
              console.log(`Image ${index}: File upload - ${image.file.name}`);
            } else if (image.path) {
              formData.append(`images[${index}][path]`, image.path);
              console.log(`Image ${index}: Existing path - ${image.path}`);
            }
            formData.append(`images[${index}][alt_text]`, image.alt_text || '');
            formData.append(`images[${index}][is_primary]`, image.is_primary ? '1' : '0');
            formData.append(`images[${index}][sort_order]`, String(image.sort_order || index));
          });
        }

        // Add variations
        if (data.variations && Array.isArray(data.variations)) {
          console.log('Processing variations:', data.variations.length);
          data.variations.forEach((variation: any, index: number) => {
            if (variation.id) {
              formData.append(`variations[${index}][id]`, String(variation.id));
            }
            formData.append(`variations[${index}][sku]`, variation.sku);
            formData.append(`variations[${index}][price]`, String(variation.price));
            formData.append(`variations[${index}][quantity]`, String(variation.quantity));
            
            console.log(`Variation ${index}:`, {
              id: variation.id || 'NEW',
              sku: variation.sku,
              price: variation.price,
              quantity: variation.quantity,
              attributes: variation.attributes
            });
            
            // Add attributes as JSON string or individual fields
            if (variation.attributes && typeof variation.attributes === 'object') {
              Object.entries(variation.attributes).forEach(([key, value]) => {
                formData.append(`variations[${index}][attributes][${key}]`, String(value));
                console.log(`  - Attribute: ${key} = ${value}`);
              });
            }
            
            if (variation.sort_order !== undefined) {
              formData.append(`variations[${index}][sort_order]`, String(variation.sort_order));
            }
          });
        }

        // Add deleted variation IDs (for updates only)
        if (data.deleted_variation_ids && Array.isArray(data.deleted_variation_ids)) {
          console.log('Processing deleted variations:', data.deleted_variation_ids);
          data.deleted_variation_ids.forEach((id: number, index: number) => {
            formData.append(`deleted_variation_ids[${index}]`, String(id));
          });
        }
        
        console.log('Sending FormData to API (POST with _method=PUT)...');
        console.groupEnd();
        
        const response = await api.post(`/api/admin/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        console.log('Sending JSON data to API (PUT)...');
        console.groupEnd();
        
        const response = await api.put(`/api/admin/products/${id}`, data);
        return response.data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
    ...options,
  });
};

export const useDeleteProduct = (options?: UseMutationOptions<any, any, number>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/admin/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    ...options,
  });
};

export const useAddProductVariation = (options?: UseMutationOptions<any, any, { productId: number; data: VariationData }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: VariationData }) => {
      const response = await api.post(`/api/admin/products/${productId}/variations`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

export const useUpdateProductVariation = (
  options?: UseMutationOptions<any, any, { productId: number; variationId: number; data: Partial<VariationData> }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, variationId, data }) => {
      const response = await api.put(`/api/admin/products/${productId}/variations/${variationId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

export const useDeleteProductVariation = (
  options?: UseMutationOptions<any, any, { productId: number; variationId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, variationId }) => {
      const response = await api.delete(`/api/admin/products/${productId}/variations/${variationId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

// ============================================
// PRODUCT IMAGE MANAGEMENT HOOKS
// ============================================

interface ProductImageData {
  path?: string;
  file?: File;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

interface AddImagesData {
  images: ProductImageData[];
}

interface UpdateImageData {
  path?: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

interface ReorderImagesData {
  image_ids: number[];
}

/**
 * Add images to an existing product (without replacing existing ones)
 */
export const useAddProductImages = (
  options?: UseMutationOptions<any, any, { productId: number; data: AddImagesData }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: AddImagesData }) => {
      const formData = new FormData();
      
      data.images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images[${index}][file]`, image.file);
        } else if (image.path) {
          formData.append(`images[${index}][path]`, image.path);
        }
        if (image.alt_text) {
          formData.append(`images[${index}][alt_text]`, image.alt_text);
        }
        formData.append(`images[${index}][is_primary]`, image.is_primary ? '1' : '0');
        formData.append(`images[${index}][sort_order]`, String(image.sort_order || index));
      });
      
      const response = await api.post(`/api/admin/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

/**
 * Update a single product image
 */
export const useUpdateProductImage = (
  options?: UseMutationOptions<any, any, { productId: number; imageId: number; data: UpdateImageData }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, imageId, data }) => {
      const response = await api.put(`/api/admin/products/${productId}/images/${imageId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

/**
 * Delete a single product image
 */
export const useDeleteProductImage = (
  options?: UseMutationOptions<any, any, { productId: number; imageId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, imageId }) => {
      const response = await api.delete(`/api/admin/products/${productId}/images/${imageId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

/**
 * Set an image as primary
 */
export const useSetPrimaryProductImage = (
  options?: UseMutationOptions<any, any, { productId: number; imageId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, imageId }) => {
      const response = await api.post(`/api/admin/products/${productId}/images/${imageId}/set-primary`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};

/**
 * Reorder product images
 */
export const useReorderProductImages = (
  options?: UseMutationOptions<any, any, { productId: number; data: ReorderImagesData }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }) => {
      const response = await api.post(`/api/admin/products/${productId}/images/reorder`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
    ...options,
  });
};
