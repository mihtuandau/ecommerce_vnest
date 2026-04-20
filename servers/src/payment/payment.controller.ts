import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Req,
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
import { Request } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) 
  @ApiOperation({ summary: 'Tạo payment mới và lấy link thanh toán VNPay' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const ipAddr = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.paymentService.create(createPaymentDto, ipAddr as string);
  }

  @Get('vnpay-return')
  @ApiOperation({ summary: 'Xử lý kết quả trả về từ VNPay (Return URL)' })
  async handleVNPayReturn(@Query() query: any) {
    return this.paymentService.handleVNPayReturn(query);
  }

  // Khôi phục endpoint sync để không lỗi Frontend Admin
  @Post(':id/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Đồng bộ trạng thái (Tính năng tương thích ngược)' })
  async syncPaymentStatus(@Param('id') id: string) {
    // Với VNPay, trạng thái sẽ cập nhật qua Return URL hoặc IPN, 
    // ở đây trả về dữ liệu hiện tại để tránh lỗi UI
    return this.paymentService.findOne(+id);
  }

  // Khôi phục endpoint cancel để không lỗi Frontend Admin
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Hủy thanh toán' })
  async cancelPayment(@Param('id') id: string) {
    return this.paymentService.updateStatus(+id, { status: 'CANCELLED' });
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
