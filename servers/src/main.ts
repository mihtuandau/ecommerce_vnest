import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { AppModule } from './app.module';
import { getHelmetConfig } from './config/helmet.config';
import { createCspNonceMiddleware } from './common/middleware/csp-nonce.middleware';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const csrfNonce = crypto.randomBytes(16).toString('base64');

  app.use(helmet(getHelmetConfig(csrfNonce)));

  app.use(compression({
    threshold: 1024, 
    level: 6,        
    filter: (req, res) => {

      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  }));

  app.use(createCspNonceMiddleware());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://dautuan.com,https://www.dautuan.com').split(',');
  
  app.enableCors({
    origin: allowedOrigins, 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type, Accept, Origin, X-Requested-With',
    exposedHeaders: 'Content-Disposition',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply global exception filter for better error context
  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription('API for clothing e-commerce backend')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      customSiteTitle: 'E-commerce API',
      customfavIcon: '/api-docs/favicon-32x32.png',
      customCssUrl: '/api-docs/swagger-ui.css',
      useGlobalPrefix: false,
    });
  }

  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 5000; 
  await app.listen(port);
  logger.log(`App running on http://localhost:${port}`);
  logger.log(`Swagger docs at http://localhost:${port}/api-docs`);
}
bootstrap();






