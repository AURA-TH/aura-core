export interface ProductFaqResponseDto {
  id: string;
  businessId: string;
  productId: string;
  question: string;
  answer: string;
  createdAt: string; // ISO 8601, UTC
  updatedAt: string; // ISO 8601, UTC
}
