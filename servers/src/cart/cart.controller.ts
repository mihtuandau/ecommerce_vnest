import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Request() req, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, body);
  }

  @Put('items/:variantId')
  updateItem(@Request() req, @Param('variantId') variantId: string, @Body() body: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.userId, +variantId, body);
  }

  @Delete('items/:variantId')
  removeItem(@Request() req, @Param('variantId') variantId: string) {
    return this.cartService.removeItem(req.user.userId, { variantId: +variantId });
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}







