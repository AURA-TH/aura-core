import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { BusinessController } from "./business.controller";
import { BusinessService } from "./business.service";
import { BusinessAccessGuard } from "./guards/business-access.guard";
import { BusinessRolesGuard } from "./guards/business-roles.guard";

@Module({
  imports: [AuditModule],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessAccessGuard, BusinessRolesGuard],
})
export class BusinessModule {}
