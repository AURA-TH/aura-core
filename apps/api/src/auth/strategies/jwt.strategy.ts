import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserStatus } from "@aura/shared";
import { PrismaService } from "../../prisma/prisma.service";

export interface JwtPayload {
  sub: string; // user id
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = config.get<string>("JWT_SECRET");
    if (!secret) {
      // Defensive: ConfigModule already guards this in production.
      throw new UnauthorizedException("JWT secret is not configured");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Runs on every JwtAuthGuard-protected request. Beyond verifying the token
   * signature/expiry (done by passport-jwt), we re-check the user against the
   * database so a token issued before a SUSPENDED/DISABLED change — or for a
   * since-deleted user — cannot access protected routes.
   *
   * Returns only safe fields (id, email). passwordHash is never loaded into
   * the returned object.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return { id: user.id, email: user.email };
  }
}
