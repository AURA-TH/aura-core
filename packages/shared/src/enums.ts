/**
 * Shared enum contracts for AURA.
 *
 * These mirror the Prisma `enum` declarations in
 * `packages/database/prisma/schema.prisma` one-to-one (identical member names).
 * Prisma enums are DB-level types and are not directly importable as plain
 * app contracts, so these const objects are the app-facing source of truth.
 * Keep both in sync when either changes.
 */

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INVITED: "INVITED",
  SUSPENDED: "SUSPENDED",
  DISABLED: "DISABLED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const BusinessMemberRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  VIEWER: "VIEWER",
  AI_AGENT: "AI_AGENT",
} as const;
export type BusinessMemberRole =
  (typeof BusinessMemberRole)[keyof typeof BusinessMemberRole];

export const ConversationStatus = {
  OPEN: "OPEN",
  WAITING_OWNER: "WAITING_OWNER",
  WAITING_CUSTOMER: "WAITING_CUSTOMER",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ConversationStatus =
  (typeof ConversationStatus)[keyof typeof ConversationStatus];

export const ConversationChannel = {
  MANUAL_TEST: "MANUAL_TEST",
  WEBSITE: "WEBSITE",
  FACEBOOK: "FACEBOOK",
  LINE: "LINE",
  INSTAGRAM: "INSTAGRAM",
  TIKTOK: "TIKTOK",
  SHOPEE: "SHOPEE",
  LAZADA: "LAZADA",
  OTHER: "OTHER",
} as const;
export type ConversationChannel =
  (typeof ConversationChannel)[keyof typeof ConversationChannel];

export const MessageSender = {
  CUSTOMER: "CUSTOMER",
  USER: "USER",
  AI: "AI",
  SYSTEM: "SYSTEM",
} as const;
export type MessageSender = (typeof MessageSender)[keyof typeof MessageSender];

export const MessageType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  FILE: "FILE",
  SYSTEM_NOTE: "SYSTEM_NOTE",
  AI_SUGGESTION: "AI_SUGGESTION",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const AiActionType = {
  DRAFT_REPLY: "DRAFT_REPLY",
  SEND_MESSAGE: "SEND_MESSAGE",
  CREATE_TASK: "CREATE_TASK",
  UPDATE_CUSTOMER: "UPDATE_CUSTOMER",
  RECOMMEND_PRODUCT: "RECOMMEND_PRODUCT",
  WRITE_MEMORY: "WRITE_MEMORY",
  SUMMARIZE_CONVERSATION: "SUMMARIZE_CONVERSATION",
  OTHER: "OTHER",
} as const;
export type AiActionType = (typeof AiActionType)[keyof typeof AiActionType];

export const AiActionStatus = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXECUTED: "EXECUTED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type AiActionStatus =
  (typeof AiActionStatus)[keyof typeof AiActionStatus];

export const ApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;
export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const AiMemoryType = {
  CUSTOMER_PREFERENCE: "CUSTOMER_PREFERENCE",
  PURCHASE_PATTERN: "PURCHASE_PATTERN",
  CONVERSATION_SUMMARY: "CONVERSATION_SUMMARY",
  BUSINESS_RULE: "BUSINESS_RULE",
  PRODUCT_INSIGHT: "PRODUCT_INSIGHT",
  FOLLOW_UP_NOTE: "FOLLOW_UP_NOTE",
  DECISION_NOTE: "DECISION_NOTE",
  OTHER: "OTHER",
} as const;
export type AiMemoryType = (typeof AiMemoryType)[keyof typeof AiMemoryType];

export const Language = {
  TH: "TH",
  EN: "EN",
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const SalesStage = {
  NEW_LEAD: "NEW_LEAD",
  INTERESTED: "INTERESTED",
  CONSIDERING: "CONSIDERING",
  READY_TO_BUY: "READY_TO_BUY",
  PURCHASED: "PURCHASED",
  LOST: "LOST",
  FOLLOW_UP: "FOLLOW_UP",
} as const;
export type SalesStage = (typeof SalesStage)[keyof typeof SalesStage];

export const ActorType = {
  USER: "USER",
  AI: "AI",
  SYSTEM: "SYSTEM",
} as const;
export type ActorType = (typeof ActorType)[keyof typeof ActorType];
