import { SentryModule } from '@sentry/nestjs/setup';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuthModule } from './auth/auth.module';  
import { UserModule } from './user/user.module';  
import { ProductModule } from './product/product.module';  
import { CartModule } from './cart/cart.module';  
import { OrderModule } from './order/order.module'; 
import { UploadModule } from './upload/upload.module'; 
import { CacheModule } from './cache/cache.module';  
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DiscountModule } from './discount/discount.module';
import { BannerModule } from './banner/banner.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './mail/mail.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ReviewModule } from './review/review.module';
import { AddressModule } from './address/address.module';
import { ReportModule } from './report/report.module';
import { HealthModule } from './common/health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GHNModule } from './ghn/ghn.module';
import { BrandModule } from './brand/brand.module';
import { ReturnModule } from './return/return.module';
import { MaintenanceModule } from './common/maintenance/maintenance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    SentryModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          username: config.get('REDIS_USERNAME', 'default'),
          password: config.get('REDIS_PASSWORD'),
          connectTimeout: 10000,
          retryStrategy: (times) => {
            return Math.min(times * 100, 3000);
          }
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 30, // Tăng lên 30 để Chatbot không bị chặn khi load nhiều card
    }, {
      name: 'medium',
      ttl: 60000,
      limit: 100, // Tăng lên 100 req / min
    }, {
      name: 'long',
      ttl: 3600000,
      limit: 1000, // 1000 req / hour
    }]),
    AuthModule,  
    UserModule,  
    ProductModule,  
    CartModule,
    OrderModule,
    UploadModule,
    CacheModule,
    CategoryModule,
    PaymentModule,
    DashboardModule,
    DiscountModule,
    BannerModule,
    WishlistModule,
    ChatModule,
    MailModule,
    ChatbotModule,
    ReviewModule,
    AddressModule,
    ReportModule,
    HealthModule,
    BrandModule,
    GHNModule,
    ReturnModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
