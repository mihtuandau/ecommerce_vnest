// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { DashboardModule } from './dashboard/dashboard.module';
import { DiscountModule } from './discount/discount.module';
import { BannerModule } from './banner/banner.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ChatModule } from './chat/chat.module';
import { MailModule } from './mail/mail.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ReviewModule } from './review/review.module';
import { AddressModule } from './address/address.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  
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
    ShippingModule
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}