import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { ProductController } from "./product.controller";
import { ProductFaqController } from "./product-faq.controller";
import { ProductService } from "./product.service";
import { ProductFaqService } from "./product-faq.service";
import { BusinessAccessGuard } from "../business/guards/business-access.guard";
import { BusinessRolesGuard } from "../business/guards/business-roles.guard";

@Module({
  imports: [AuditModule],
  controllers: [ProductController, ProductFaqController],
  providers: [
    ProductService,
    ProductFaqService,
    BusinessAccessGuard,
    BusinessRolesGuard,
  ],
})
export class ProductModule {}
