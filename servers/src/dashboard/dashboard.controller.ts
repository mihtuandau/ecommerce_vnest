import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { ReportQueryDto } from '../report/dto/report-query.dto';

@ApiTags('Dashboard')
@ApiBearerAuth('Authorization')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Permissions('report.view')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  @Permissions('report.view')
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'year', required: false, type: Number })
  getRevenue(@Query() query: ReportQueryDto) {
    return this.dashboardService.getRevenueAnalytics(query);
  }

  @Get('recent-orders')
  @Permissions('report.view')
  getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }

  @Get('top-products')
  @Permissions('report.view')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }
}


