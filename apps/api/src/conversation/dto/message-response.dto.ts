import { MessageSender, MessageType } from "@aura/shared";

export interface MessageResponseDto {
  id: string;
  businessId: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  metadata: unknown;
  createdAt: string;
}

export interface PaginatedMessagesDto {
  data: MessageResponseDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
