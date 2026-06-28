import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BrandService } from './brand.service';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('product.manage')
  @ApiBearerAuth('Authorization')
  create(@Body() body: { name: string; logo?: string }) {
    return this.brandService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('product.manage')
  @ApiBearerAuth('Authorization')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; logo?: string },
  ) {
    return this.brandService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('product.manage')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
