// src/payment/payment.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth('Authorization')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Put(':id/status')
  @Roles('ADMIN')  // Chỉ admin update status
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdatePaymentStatusDto) {
    return this.paymentService.updateStatus(+id, updateStatusDto);
  }

  @Get()
  findAll(@Query() query: QueryPaymentDto) {
    return this.paymentService.findAll(query);
  }
}

