import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Language, UserStatus } from "@aura/shared";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto, SafeUserDto } from "./dto/auth-response.dto";
import { AuthenticatedUser, JwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const rounds = Number(this.config.get<string>("BCRYPT_ROUNDS") ?? 12);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: dto.displayName ?? null,
        status: UserStatus.ACTIVE,
        language: Language.TH,
      },
    });

    return this.buildAuthResponse(this.toSafeUser(user));
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Generic message — do not reveal whether the email exists.
    const invalid = new UnauthorizedException("Invalid credentials");

    if (!user || !user.passwordHash) {
      throw invalid;
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw invalid;
    }

    // Only ACTIVE users may authenticate. Keep the message generic so we
    // don't reveal account state (suspended/disabled/invited).
    if (user.status !== UserStatus.ACTIVE) {
      throw invalid;
    }

    return this.buildAuthResponse(this.toSafeUser(user));
  }

  async getMe(authUser: AuthenticatedUser): Promise<SafeUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: authUser.id },
    });
    // Token may be valid but the account could be gone or deactivated since
    // it was issued. Re-check existence and ACTIVE status on every /me call.
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.toSafeUser(user);
  }

  private buildAuthResponse(user: SafeUserDto): AuthResponseDto {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload);
    return { user, accessToken };
  }

  // Maps a Prisma User to the safe DTO. passwordHash is never included.
  private toSafeUser(user: {
    id: string;
    email: string;
    displayName: string | null;
    status: UserStatus;
    language: Language;
    createdAt: Date;
  }): SafeUserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
