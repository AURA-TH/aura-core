import {
  ConversationChannel,
  ConversationStatus,
  SalesStage,
} from "@aura/shared";

export interface ConversationResponseDto {
  id: string;
  businessId: string;
  customerId: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  salesStage: SalesStage;
  subject: string | null;
  summary: string | null;
  externalThreadId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedConversationsDto {
  data: ConversationResponseDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
