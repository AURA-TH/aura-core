import "reflect-metadata";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // All routes are served under /api/v1.
  app.setGlobalPrefix("api/v1");

  // Validation: strip unknown props, reject extras, transform payloads to DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Consistent error envelope for every error response.
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS from env. No open wildcard by default; only widen for local dev.
  const isProd = config.get<string>("NODE_ENV") === "production";
  const corsOrigin = config.get<string>("CORS_ORIGIN");
  app.enableCors({
    origin: corsOrigin ?? (isProd ? false : "http://localhost:3000"),
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = Number(config.get<string>("API_PORT") ?? 3001);
  await app.listen(port);
  logger.log(`AURA API listening on http://localhost:${port}/api/v1`);
}

void bootstrap();
