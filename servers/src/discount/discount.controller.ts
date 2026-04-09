import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';
import { ValidateDiscountDto } from './dto/validate-discount.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Discounts')
@ApiBearerAuth('Authorization')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get('public')
  getPublic() {
    return this.discountService.getPublicDiscounts();
  }

  @Get('flash-sale')
  getFlashSale() {
    return this.discountService.getFlashSale();
  }

  @Get('auto-apply')
  getAutoApplyMap() {
    return this.discountService.getAutoApplyMap();
  }

  @Get('product/:productId')
  getProductDiscount(@Param('productId') productId: string) {
    return this.discountService.getProductDiscount(+productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(@Query() query: QueryDiscountDto) {
    return this.discountService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.discountService.getStats();
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validate(@Body() validateDto: ValidateDiscountDto) {
    return this.discountService.validateDiscount(validateDto.code);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}


