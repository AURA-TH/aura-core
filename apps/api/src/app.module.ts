import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { BusinessModule } from "./business/business.module";
import { ProductModule } from "./product/product.module";
import { CustomerModule } from "./customer/customer.module";
import { ConversationModule } from "./conversation/conversation.module";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HealthModule,
    AuditModule,
    AuthModule,
    BusinessModule,
    ProductModule,
    CustomerModule,
    ConversationModule,
  ],
})
export class AppModule {}
