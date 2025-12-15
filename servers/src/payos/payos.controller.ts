// src/payos/payos.controller.ts
import { 
  Controller, 
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayOSService } from './payos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePayOSPaymentDto, PayOSWebhookDto } from './dto';

@ApiTags('PayOS')
@Controller('payos')
export class PayOSController {
  constructor(private readonly payosService: PayOSService) {}

  @Post('payment-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo payment link PayOS' })
  @ApiResponse({ status: 201, description: 'Payment link được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async createPaymentLink(@Body() createPaymentDto: CreatePayOSPaymentDto) {
    return this.payosService.createPaymentLink(createPaymentDto);
  }

  @Get('payment/:orderCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy thông tin payment từ PayOS' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy payment' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getPaymentInfo(@Param('orderCode') orderCode: string) {
    return this.payosService.getPaymentInfo(+orderCode);
  }

  @Delete('payment/:orderCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hủy payment link PayOS' })
  @ApiResponse({ status: 200, description: 'Hủy payment thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy payment' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async cancelPaymentLink(
    @Param('orderCode') orderCode: string,
    @Body('cancellationReason') cancellationReason?: string
  ) {
    return this.payosService.cancelPaymentLink(+orderCode, cancellationReason);
  }
}