import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('Authorization')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('ADMIN')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  @Roles('ADMIN')
  getRevenue() {
    return this.dashboardService.getRevenueAnalytics();
  }

  @Get('recent-orders')
  @Roles('ADMIN')
  getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }

  @Get('top-products')
  @Roles('ADMIN')
  getTopProducts() {
    return this.dashboardService.getTopProducts();
  }
}


