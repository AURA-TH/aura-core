import {
  BusinessMemberRole,
  Language,
  UserStatus,
} from "@aura/shared";

/**
 * Safe business shape returned to members, including the caller's own role.
 */
export interface BusinessResponseDto {
  id: string;
  name: string;
  slug: string | null;
  businessType: string | null;
  description: string | null;
  toneOfVoice: string | null;
  shippingPolicy: string | null;
  paymentPolicy: string | null;
  locale: string;
  timezone: string;
  currency: string;
  language: Language;
  openingHours: unknown;
  metadata: unknown;
  createdAt: string; // ISO 8601, UTC
  updatedAt: string; // ISO 8601, UTC
  role: BusinessMemberRole; // the requesting user's role in this business
}

/**
 * Member row visible to fellow members of the same business.
 */
export interface BusinessMemberResponseDto {
  userId: string;
  displayName: string | null;
  email: string;
  userStatus: UserStatus;
  role: BusinessMemberRole;
  joinedAt: string; // ISO 8601, UTC (BusinessMember.createdAt)
}
