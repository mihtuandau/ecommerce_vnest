import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ReportService } from './report.service';
import { ReportQueryDto } from './dto/report-query.dto';

@ApiTags('Reports')
@ApiBearerAuth('Authorization')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get('revenue')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get revenue report by period (daily/monthly/yearly)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'year', required: false, description: 'Year for monthly report' })
  @ApiQuery({ name: 'startYear', required: false, description: 'Start year for yearly report' })
  @ApiQuery({ name: 'endYear', required: false, description: 'End year for yearly report' })
  getRevenueReport(@Query() query: ReportQueryDto) {
    return this.reportService.getRevenueByPeriod(query);
  }

  @Get('orders')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get orders report by status' })
  getOrdersReport(@Query() query: ReportQueryDto) {
    return this.reportService.getOrdersReport(query);
  }

  @Get('top-products')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products to return', type: Number })
  getTopProductsReport(@Query() query: ReportQueryDto) {
    return this.reportService.getTopProductsReport(query);
  }

  @Get('top-categories')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get top selling categories' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of categories to return', type: Number })
  getTopCategoriesReport(@Query() query: ReportQueryDto) {
    return this.reportService.getTopCategoriesReport(query);
  }

  @Get('customers')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get customer statistics' })
  getCustomerReport(@Query() query: ReportQueryDto) {
    return this.reportService.getCustomerReport(query);
  }

  @Get('summary')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get comprehensive summary report' })
  getSummaryReport(@Query() query: ReportQueryDto) {
    return this.reportService.getSummaryReport(query);
  }

  @Get('export')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Export report to Excel' })
  async exportReport(@Query() query: ReportQueryDto, @Res() res: Response) {
    const buffer = await this.reportService.exportToExcel(query);
    
    const filename = `report_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }
}
