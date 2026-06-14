import { ConversationChannel, Language } from "@aura/shared";

export interface CustomerResponseDto {
  id: string;
  businessId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  sourceChannel: ConversationChannel | null;
  externalId: string | null;
  province: string | null;
  tags: unknown;
  notes: string | null;
  customerScore: number | null;
  lastContactAt: string | null;
  lastPurchaseAt: string | null;
  nextFollowUpAt: string | null;
  language: Language;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCustomersDto {
  data: CustomerResponseDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
