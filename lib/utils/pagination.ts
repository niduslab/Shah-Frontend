export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  perPage: number,
  total: number
): PaginatedResponse<T> => {
  const lastPage = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, total);

  return {
    success: true,
    data,
    pagination: {
      total,
      per_page: perPage,
      current_page: page,
      last_page: lastPage,
      from: startIndex + 1,
      to: endIndex,
    },
  };
};

/**
 * Ensures a response has the standard pagination format
 * Converts from Laravel-style pagination if needed
 */
export const normalizePaginatedResponse = <T>(response: any): PaginatedResponse<T> => {
  // If already in correct format, return as-is
  if (response.success && response.pagination) {
    return response;
  }

  // If it's Laravel-style pagination (has meta key), convert it
  if (response.meta) {
    return {
      success: true,
      data: response.data,
      pagination: response.meta,
    };
  }

  // Fallback: assume it's just data array
  return {
    success: true,
    data: response.data || response,
    pagination: {
      total: (response.data || response).length,
      per_page: (response.data || response).length,
      current_page: 1,
      last_page: 1,
      from: 1,
      to: (response.data || response).length,
    },
  };
};
