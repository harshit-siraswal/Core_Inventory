import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { AddressInfo } from 'node:net';
import cookieParser from 'cookie-parser';

function validateJwtSecrets() {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be configured');
  }

  if (jwtSecret.length < 32 || jwtRefreshSecret.length < 32) {
    throw new Error('JWT secrets must be at least 32 characters');
  }

  if (jwtSecret === jwtRefreshSecret) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  }
}

function getValidatedPort(): number {
  const rawPort = process.env.PORT;
  if (!rawPort) {
    return 3000;
  }

  const parsed = parseInt(rawPort, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 65535) {
    console.warn(`Invalid PORT value "${rawPort}". Falling back to 3000.`);
    return 3000;
  }

  return parsed;
}

async function bootstrap() {
  validateJwtSecrets();

  const app = await NestFactory.create(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(cookieParser());

  // CORS — allow frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  if (!isProduction) {
    // Swagger documentation is only enabled outside production.
    const config = new DocumentBuilder()
      .setTitle('CoreInventory API')
      .setDescription('Inventory Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = getValidatedPort();
  const host = process.env.HOST ?? '0.0.0.0';
  const server = await app.listen(port, host);
  const address = server.address() as AddressInfo | string | null;

  const boundPort =
    typeof address === 'object' && address ? address.port : port;
  const boundHost =
    typeof address === 'object' && address
      ? address.address === '::' || address.address === ''
        ? host
        : address.address
      : host;
  const displayHost =
    boundHost === '0.0.0.0' || boundHost === '::' ? 'localhost' : boundHost;

  console.log(`Server running on port ${boundPort}`);
  console.log(
    !isProduction
      ? `Swagger docs at http://${displayHost}:${boundPort}/api/docs`
      : 'Swagger docs are disabled in production',
  );
}
bootstrap();
