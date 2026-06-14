import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@aura/database";

/**
 * The single way the API accesses Prisma.
 *
 * Extends the generated PrismaClient (re-exported by @aura/database) so the
 * schema and types stay in one place. We do NOT import the `prisma` singleton
 * from @aura/database here — Nest manages this provider's lifecycle, and mixing
 * two singleton patterns in the same process is exactly what we avoid.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Prisma connected");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Prisma disconnected");
  }
}
