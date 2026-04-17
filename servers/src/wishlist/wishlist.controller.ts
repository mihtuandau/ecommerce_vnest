import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post(':variantId')
  async addToWishlist(@Request() req, @Param('variantId') variantId: string) {
    return this.wishlistService.addToWishlist(
      req.user.userId,
      parseInt(variantId),
    );
  }

  @Delete(':variantId')
  async removeFromWishlist(
    @Request() req,
    @Param('variantId') variantId: string,
  ) {
    return this.wishlistService.removeFromWishlist(
      req.user.userId,
      parseInt(variantId),
    );
  }

  @Get('count')
  async getCount(@Request() req) {
    const count = await this.wishlistService.getCount(req.user.userId);
    return { count };
  }

  @Get('check/:variantId')
  async checkWishlist(@Request() req, @Param('variantId') variantId: string) {
    const isInWishlist = await this.wishlistService.isInWishlist(
      req.user.userId,
      parseInt(variantId),
    );
    return { isInWishlist };
  }

  @Delete()
  async clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.userId);
  }
}








