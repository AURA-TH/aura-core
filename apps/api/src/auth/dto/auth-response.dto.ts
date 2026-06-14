import { Language, UserStatus } from "@aura/shared";

/**
 * Safe representation of a User for API responses.
 * NEVER includes passwordHash.
 */
export interface SafeUserDto {
  id: string;
  email: string;
  displayName: string | null;
  status: UserStatus;
  language: Language;
  createdAt: string; // ISO 8601, UTC
}

/**
 * Returned by register and login: the safe user plus an access token.
 */
export interface AuthResponseDto {
  user: SafeUserDto;
  accessToken: string;
}
