// src/payment/payment.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Tạo payment mới và lấy payment link (nếu là PayOS) - Public endpoint cho guest checkout' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    // Public endpoint - allows guest checkout with PayOS
    return this.paymentService.create(createPaymentDto);
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đồng bộ trạng thái thanh toán với PayOS (Admin only)' })
  async syncPaymentStatus(@Param('id') id: string) {
    return this.paymentService.syncPaymentWithPayOS(+id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Hủy payment link PayOS' })
  async cancelPayOSPayment(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.paymentService.cancelPayOSPayment(+id, reason);
  }

  @Get('payos/order/:orderCode')
  @ApiOperation({ summary: 'Lấy payment và thông tin đơn hàng theo PayOS order code' })
  async getPaymentByOrderCode(@Param('orderCode') orderCode: string) {
    return this.paymentService.findByPayosOrderCode(+orderCode);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Lấy thông tin payment theo ID' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Cập nhật trạng thái payment (Admin only)' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdatePaymentStatusDto) {
    return this.paymentService.updateStatus(+id, updateStatusDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Lấy danh sách payments' })
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentService.findAll(query);
  }
}

