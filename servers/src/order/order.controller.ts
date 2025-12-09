import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,

} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Create new order from cart' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or cart empty' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() body: CreateOrderDto) {
    return this.orderService.create(req.user.userId, body);
  }

  @Post('guest')
  @ApiOperation({ summary: 'Create order as guest (no authentication required)' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Guest order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - missing required fields' })
  createGuestOrder(@Body() body: CreateOrderDto) {
    // Guest checkout - no userId
    return this.orderService.create(null, body);
  }

  @Get('guest/lookup/:orderCode')
  @ApiOperation({ summary: 'Lookup guest order by order code and email/phone' })
  @ApiParam({ name: 'orderCode', description: 'Order Code (e.g., ORD-ABC123)', type: String })
  @ApiQuery({ name: 'contact', description: 'Guest email or phone number', required: true })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found or contact mismatch' })
  async lookupGuestOrder(
    @Param('orderCode') orderCode: string,
    @Query('contact') contact: string,
  ) {
    return this.orderService.lookupGuestOrder(orderCode, contact);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyOrders(@Query() query: QueryOrderDto, @Req() req: any) {
    const mergedQuery = {
      ...query,
      userId: req.user.userId,
      page: 1,
      limit: 1000
    };
    return this.orderService.findAll(mergedQuery);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get user orders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
  })
  @ApiResponse({ status: 200, description: 'List of orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: QueryOrderDto, @Req() req: any) {
    // ✅ Thêm @Req() để lấy req.user
    // Merge userId từ JWT (user chỉ xem của mình, admin xem all)
    const userIdFromToken = req.user.userId; // Từ JWT payload
    const mergedQuery = {
      ...query,
      userId: req.user.role === 'ADMIN' ? query.userId : userIdFromToken,
    }; // ✅ Fix: Merge 1 arg

    return this.orderService.findAll(mergedQuery); // Truyền 1 arg duy nhất
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'ID order', type: Number })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID order', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Cancel order (only PENDING status)' })
  @ApiParam({ name: 'id', description: 'ID order', type: Number })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.orderService.cancelOrder(+id, req.user.userId);
  }

  @Post(':id/discount')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Apply discount to order' })
  @ApiParam({ name: 'id', description: 'ID order', type: Number })
  @ApiBody({ type: ApplyDiscountDto })
  @ApiResponse({ status: 200, description: 'Discount applied' })
  @ApiResponse({ status: 400, description: 'Invalid discount' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  applyDiscount(@Param('id') id: string, @Body() body: ApplyDiscountDto) {
    return this.orderService.applyDiscount(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Delete order (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID order', type: Number })
  @ApiBody({ type: DeleteOrderDto })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Body() body: DeleteOrderDto) {
    if (!body.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.orderService.remove(+id);
  }
}
