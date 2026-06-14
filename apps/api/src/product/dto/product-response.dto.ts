export interface ProductResponseDto {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  sku: string | null;
  brand: string | null;
  category: string | null;
  price: string; // money as string
  cost: string | null; // money as string
  currency: string;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  metadata: unknown;
  createdAt: string; // ISO 8601, UTC
  updatedAt: string; // ISO 8601, UTC
}

export interface PaginatedProductsDto {
  data: ProductResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
