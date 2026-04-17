
import { 
  Controller, 
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PayOSService } from './payos.service';
import { PayOSWebhookDto } from './dto';


@ApiTags('PayOS Webhooks')
@Controller('webhooks/payos')
export class PayOSWebhookController {
  constructor(private readonly payosService: PayOSService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook từ PayOS để cập nhật trạng thái thanh toán (Public endpoint)' })
  @ApiResponse({ status: 200, description: 'Webhook được xử lý thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu webhook không hợp lệ' })
  async handlePayOSWebhook(@Body() webhookData: PayOSWebhookDto) {

    try {
      const result = await this.payosService.verifyPaymentWebhookData(webhookData);

      return { success: true, data: result };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }


}





