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
  Ip,
  Res,
  BadRequestException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrderService } from './order.service';
import { OrderInvoice } from './order.invoice';
import { AdminCreateOrderDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() body: CreateOrderDto, @Ip() ip: string) {
    return this.orderService.create(
      req.user.userId,
      body,
      { role: req.user.role },
      ip,
    );
  }

  @Post('guest')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  createGuestOrder(@Body() body: CreateOrderDto, @Ip() ip: string) {
    return this.orderService.create(null, body, { role: 'GUEST' }, ip);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('order.manage')
  @ApiBearerAuth('Authorization')
  adminCreate(
    @Request() req,
    @Body() body: AdminCreateOrderDto,
    @Ip() ip: string,
  ) {
    // Admin có thể truyền userId trực tiếp trong body
    return this.orderService.create(
      body.userId || null,
      body,
      { role: req.user.role },
      ip,
    );
  }

  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Get('guest/lookup/:orderCode')
  async lookupGuestOrder(
    @Param('orderCode') orderCode: string,
    @Query('contact') contact: string,
    @Ip() ip: string,
    @Req() req: any,
  ) {
    const ua = req.headers['user-agent'];
    return this.orderService.lookupGuestOrder(orderCode, contact, ip, ua);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Query() query: QueryOrderDto, @Req() req: any) {
    const mergedQuery = {
      ...query,
      userId: req.user.userId,
      page: 1,
      limit: 1000,
    };
    return this.orderService.findAll(mergedQuery);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('order.view')
  @ApiBearerAuth('Authorization')
  async findAll(@Query() query: QueryOrderDto, @Req() req: any) {
    const userIdFromToken = req.user.userId;
    const userRole = req.user.role;
    const userPermissions = req.user.permissions || [];

    const canViewAll =
      userRole === 'ADMIN' || userPermissions.includes('order.view');

    const mergedQuery = {
      ...query,
      userId: canViewAll ? query.userId : userIdFromToken,
    };

    return this.orderService.findAll(mergedQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.orderService.findOne(+id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('order.manage')
  @ApiBearerAuth('Authorization')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.orderService.cancelOrder(+id, req.user);
  }

  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Put('guest/:orderCode/cancel')
  async cancelGuestOrder(
    @Param('orderCode') orderCode: string,
    @Query('contact') contact: string,
  ) {
    const result = await this.orderService.cancelGuestOrder(orderCode, contact);
    return { success: true, data: result };
  }

  @Post(':id/discount')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  applyDiscount(
    @Param('id') id: string,
    @Body() body: ApplyDiscountDto,
    @Req() req: any,
  ) {
    return this.orderService.applyDiscount(+id, body, {
      userId: req.user.userId,
      role: req.user.role,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('order.manage')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string, @Body() body: DeleteOrderDto) {
    if (!body.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.orderService.remove(+id);
  }

  @Post(':id/ghn')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('order.manage')
  @ApiBearerAuth('Authorization')
  syncToGHN(@Param('id') id: string) {
    return this.orderService.syncToGHN(+id);
  }

  @Get(':id/invoice')
  @UseGuards(JwtAuthGuard)
  async downloadInvoice(
    @Param('id') id: number,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findOne(id, req.user);
    return OrderInvoice.generate(order, res);
  }

  @Throttle({ short: { ttl: 60000, limit: 5 } })
  @Get('guest/invoice/:code')
  async downloadGuestInvoice(
    @Param('code') code: string,
    @Query('contact') contact: string,
    @Res() res: Response,
  ) {
    // Lấy order thô (chưa mask) để generate invoice, nhưng phải kiểm tra quyền
    const order = await this.orderService.lookupGuestOrder(
      code,
      contact,
      undefined,
      undefined,
      false,
    );

    if (order.userId) {
      throw new BadRequestException(
        'Đơn hàng này đã được liên kết với một tài khoản thành viên. Vui lòng đăng nhập để tải hóa đơn.',
      );
    }

    return OrderInvoice.generate(order, res);
  }

  @Post('ghn/webhook')
  handleGHNWebhook(@Headers('token') token: string, @Body() body: any) {
    if (token !== process.env.GHN_TOKEN) {
      throw new UnauthorizedException('Invalid GHN Webhook Token');
    }
    return this.orderService.handleGHNWebhook(body);
  }
}
