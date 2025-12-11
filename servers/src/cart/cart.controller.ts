import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth('Authorization')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current cart' })
  @ApiResponse({ status: 200, description: 'Cart details with total' })
  // @ApiResponse({ status: 404, description: 'Cart not found' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiConsumes('application/json')  
  @ApiBody({ type: AddCartItemDto })
  @ApiResponse({ status: 201, description: 'Item added' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  addItem(@Request() req, @Body() body: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, body);
  }

  @Put('items/:variantId')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiParam({ name: 'variantId', description: 'ID variant to update', type: Number })
  @ApiConsumes('application/json')
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  updateItem(@Request() req, @Param('variantId') variantId: string, @Body() body: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.userId, +variantId, body);
  }

  @Delete('items/:variantId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'variantId', description: 'ID variant to remove', type: Number })
  @ApiResponse({ status: 200, description: 'Item removed' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  removeItem(@Request() req, @Param('variantId') variantId: string) {
    return this.cartService.removeItem(req.user.userId, { variantId: +variantId });
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}