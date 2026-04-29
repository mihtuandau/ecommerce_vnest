import { Controller, Get, Param, ParseIntPipe, Post, Body } from '@nestjs/common';
import { GHNService } from './ghn.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('GHN (Giao Hàng Nhanh)')
@Controller('ghn')
export class GHNController {
  constructor(private readonly ghnService: GHNService) {}

  @ApiOperation({ summary: 'Lấy danh sách Tỉnh/Thành phố' })
  @Get('provinces')
  getProvinces() {
    return this.ghnService.getProvinces();
  }

  @ApiOperation({ summary: 'Lấy danh sách Quận/Huyện theo Tỉnh' })
  @Get('districts/:provinceId')
  getDistricts(@Param('provinceId') provinceId: string) {
    console.log('[GHNController] Fetching districts for provinceId:', provinceId);
    return this.ghnService.getDistricts(Number(provinceId));
  }

  @ApiOperation({ summary: 'Lấy danh sách Phường/Xã theo Quận' })
  @Get('wards/:districtId')
  getWards(@Param('districtId') districtId: string) {
    console.log('[GHNController] Fetching wards for districtId:', districtId);
    return this.ghnService.getWards(Number(districtId));
  }

  @ApiOperation({ summary: 'Tính phí vận chuyển GHN' })
  @Post('calculate-fee')
  calculateFee(@Body() body: any) {
    return this.ghnService.calculateFee(body);
  }

  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng từ GHN' })
  @Get('order-detail/:orderCode')
  getOrderDetail(@Param('orderCode') orderCode: string) {
    return this.ghnService.getOrderDetail(orderCode);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái Sandbox GHN (Chỉ dành cho Test)' })
  @Post('sandbox-update')
  updateSandbox(@Body() body: { orderCode: string; status: string }) {
    return this.ghnService.updateOrderSandbox(body.orderCode, body.status);
  }
}
