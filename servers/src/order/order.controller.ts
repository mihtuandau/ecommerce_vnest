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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() body: CreateOrderDto) {
    return this.orderService.create(req.user.userId, body);
  }

  @Post('guest')
  createGuestOrder(@Body() body: CreateOrderDto) {
    // Guest checkout - no userId
    return this.orderService.create(null, body);
  }

  @Get('guest/lookup/:orderCode')
  async lookupGuestOrder(
    @Param('orderCode') orderCode: string,
    @Query('contact') contact: string,
  ) {
    return this.orderService.lookupGuestOrder(orderCode, contact);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
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
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.orderService.cancelOrder(+id, req.user.userId);
  }

  @Put('guest/:orderCode/cancel')
  async cancelGuestOrder(
    @Param('orderCode') orderCode: string,
    @Query('contact') contact: string,
  ) {
    return this.orderService.cancelGuestOrder(orderCode, contact);
  }

  @Post(':id/discount')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  applyDiscount(@Param('id') id: string, @Body() body: ApplyDiscountDto) {
    return this.orderService.applyDiscount(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string, @Body() body: DeleteOrderDto) {
    if (!body.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.orderService.remove(+id);
  }
}



