import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { BusinessAccessGuard } from "../business/guards/business-access.guard";
import { BusinessRolesGuard } from "../business/guards/business-roles.guard";

@Module({
  imports: [AuditModule],
  controllers: [CustomerController],
  providers: [CustomerService, BusinessAccessGuard, BusinessRolesGuard],
})
export class CustomerModule {}
