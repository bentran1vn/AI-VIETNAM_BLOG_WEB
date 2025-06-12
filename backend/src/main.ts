import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLExceptionFilter } from "./common/filters/graphql-exception.filter";
import * as cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3001);

  console.log(`Attempting to start server on port ${port}`);

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>("FRONTEND_URL") || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Enable validation with proper configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion of primitive types
      },
    }),
  );

  app.useGlobalFilters(new GraphQLExceptionFilter());

  try {
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
  } catch (error: unknown) {
    console.error(
      `Failed to start server on port ${port}:`,
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

bootstrap();
