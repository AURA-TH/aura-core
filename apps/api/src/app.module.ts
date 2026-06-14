import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { BusinessModule } from "./business/business.module";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HealthModule,
    AuditModule,
    AuthModule,
    BusinessModule,
  ],
})
export class AppModule {}
