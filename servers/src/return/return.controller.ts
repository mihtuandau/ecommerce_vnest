import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReturnService } from './return.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestDto } from './dto/update-return-request.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

import { CreateGuestReturnRequestDto } from './dto/create-guest-return-request.dto';

@ApiTags('Returns')
@ApiBearerAuth('Authorization')
@Controller('returns')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}
  
  @Post('guest')
  @ApiOperation({ summary: 'Khách hàng vãng lai tạo yêu cầu trả hàng' })
  createGuest(@Body() dto: CreateGuestReturnRequestDto) {
    return this.returnService.createGuest(dto);
  }

  @Post('guest/:id/confirm-sent')
  @ApiOperation({ summary: 'Khách hàng vãng lai xác nhận đã gửi hàng' })
  confirmGuestSent(
    @Param('id') id: string,
    @Body() dto: { orderCode: string; contact: string }
  ) {
    return this.returnService.confirmGuestSent(+id, dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khách hàng đã đăng nhập tạo yêu cầu trả hàng' })
  create(@Req() req: any, @Body() dto: CreateReturnRequestDto) {
    return this.returnService.create(req.user.userId, dto);
  }

  @Get('my-returns')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khách hàng xem danh sách yêu cầu trả hàng của mình' })
  getMyReturns(@Req() req: any) {
    return this.returnService.getMyReturns(req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('return.view')
  @ApiOperation({ summary: 'Admin xem toàn bộ danh sách yêu cầu trả hàng' })
  findAll(@Query() query: any) {
    return this.returnService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xem chi tiết yêu cầu trả hàng' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.returnService.findOne(+id, req.user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('return.manage')
  @ApiOperation({ summary: 'Cập nhật trạng thái yêu cầu trả hàng' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReturnRequestDto,
    @Req() req: any,
  ) {
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(req.user?.role);
    return this.returnService.updateStatus(+id, dto, req.user?.userId, isStaff);
  }
}
