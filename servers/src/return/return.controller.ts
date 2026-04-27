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

@ApiTags('Returns')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('returns')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Post()
  @ApiOperation({ summary: 'Khách hàng tạo yêu cầu trả hàng' })
  create(@Req() req: any, @Body() dto: CreateReturnRequestDto) {
    return this.returnService.create(req.user.userId, dto);
  }

  @Get('my-returns')
  @ApiOperation({ summary: 'Khách hàng xem danh sách yêu cầu trả hàng của mình' })
  getMyReturns(@Req() req: any) {
    return this.returnService.getMyReturns(req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  //@Permissions('order.manage') // Or create specific return.manage permission
  @ApiOperation({ summary: 'Admin xem toàn bộ danh sách yêu cầu trả hàng' })
  findAll(@Query() query: any) {
    return this.returnService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết yêu cầu trả hàng' })
  findOne(@Param('id') id: string) {
    return this.returnService.findOne(+id);
  }

  @Patch(':id/status')
  //@UseGuards(RolesGuard) // Remove RolesGuard if we want customers to also use this
  //@Permissions('order.manage')
  @ApiOperation({ summary: 'Cập nhật trạng thái yêu cầu trả hàng' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReturnRequestDto,
    @Req() req: any,
  ) {
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(req.user.role);
    return this.returnService.updateStatus(+id, dto, req.user.userId, isStaff);
  }
}
