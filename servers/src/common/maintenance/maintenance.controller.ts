import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { MaintenanceService } from '../maintenance/maintenance.service';

@ApiTags('Maintenance')
@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('Authorization')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Post('sync-sold-count')
  @ApiOperation({
    summary: 'Đồng bộ lại số lượng đã bán (soldCount) cho toàn bộ sản phẩm',
  })
  syncSoldCount() {
    return this.maintenanceService.syncSoldCount();
  }

  @Post('sync-ratings')
  @ApiOperation({
    summary: 'Đồng bộ lại điểm đánh giá (averageRating) cho toàn bộ sản phẩm',
  })
  syncRatings() {
    return this.maintenanceService.syncRatings();
  }
}
