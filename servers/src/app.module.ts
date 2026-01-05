
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';  
import { UserModule } from './user/user.module';  
import { ProductModule } from './product/product.module';  
import { CartModule } from './cart/cart.module';  
import { OrderModule } from './order/order.module'; 
import { UploadModule } from './upload/upload.module'; 
import { CacheModule } from './cache/cache.module';  
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { PayOSModule } from './payos/payos.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute (default)
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
    PayOSModule,
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
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}