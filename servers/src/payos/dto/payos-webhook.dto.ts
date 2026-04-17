
import { IsString, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayOSWebhookDto {
  @ApiProperty({ example: '00', description: 'Mã trạng thái' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Thành công', description: 'Mô tả trạng thái' })
  @IsString()
  desc: string;

  @ApiProperty({ description: 'Trạng thái thành công', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dữ liệu thanh toán' })
  @IsObject()
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId: string;
    counterAccountBankName: string;
    counterAccountName: string;
    counterAccountNumber: string;
    virtualAccountName: string;
    virtualAccountNumber: string;
  };

  @ApiProperty({ description: 'Chữ ký xác thực' })
  @IsString()
  signature: string;
}





